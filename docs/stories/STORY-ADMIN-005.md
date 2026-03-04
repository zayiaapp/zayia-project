# STORY-ADMIN-005: Fix Real-time Sync Bug in useRealtimeCommunity Hook

**Epic:** EPIC-003-HOTFIX: Real-time Community Sync Issues
**Status:** Draft
**Complexity:** Medium (2-3 hours)
**Priority:** CRITICAL
**Created:** 2026-03-04

## Problem Statement

Real-time messages between Admin and User community sections are NOT syncing immediately. Changes (post, delete, reactions, bans) only appear after manual page refresh (F5).

**Reported Behavior:**
- User posts message → NOT visible on Admin tab until F5
- Admin deletes message → NOT visible on User tab until F5
- Admin bans user → NOT visible on User tab until F5
- Add reactions → NOT synced in real-time between tabs

### Root Cause Analysis

#### BUG #1: Mutable Variables Reset on Re-render ❌

```typescript
// ❌ WRONG - Reinitialize to null/0 on EVERY render
let subscription: (() => void) | null = null
let reconnectTimeout: NodeJS.Timeout | null = null
let reconnectAttempts = 0
```

**Impact:**
- On render 1: subscription created ✓
- On render 2: subscription = null (lost!) ✗
- Component loses reference to active subscription

#### BUG #2: useCallback Dependency Chain ❌

```typescript
const setupRealtimeListener = useCallback(() => {
  ...
}, [userId, enabled, addMessageOptimistic, updateMessageOptimistic, removeMessageOptimistic])
```

**Impact:**
- Functions `addMessageOptimistic` etc. change every render
- This causes `setupRealtimeListener` to be recreated every render
- Which causes `useEffect` to re-run constantly
- Result: Multiple subscriptions created, old ones not cleaned up

#### BUG #3: Multiple Simultaneous Subscriptions ❌

From the above bugs, we get:
- Admin browser: 5-10 subscriptions active at once (different states)
- User browser: 5-10 subscriptions active at once (different states)
- Subscriptions out of sync = real-time events not propagating correctly

#### BUG #4: Race Condition in cleanup ❌

```typescript
const unsubscribe = useCallback(() => {
  if (subscription) {
    subscription()  // But subscription may have been reset!
    subscription = null
  }
})
```

Result: unsubscribe may try to call null function

---

## Acceptance Criteria

- [ ] Only ONE active subscription per userId at any time
- [ ] No subscription re-creation on component re-render
- [ ] Console logs show `✅ Real-time listener ready` EXACTLY ONCE on mount
- [ ] Messages posted on User → appear INSTANTLY on Admin (0-1 sec, no F5)
- [ ] Messages deleted on Admin → disappear INSTANTLY on User (0-1 sec, no F5)
- [ ] User banned on Admin → User sees ban notification INSTANTLY
- [ ] Works with 2+ simultaneous browser connections
- [ ] ESLint: 0 warnings
- [ ] TypeScript: 0 errors
- [ ] npm run build: succeeds without errors

---

## Implementation Plan

### Phase 1: Convert to useRef (50 min)

Replace mutable variables with useRef for persistence across renders:

```typescript
// ✅ CORRECT
const subscriptionRef = useRef<(() => void) | null>(null)
const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
const reconnectAttemptsRef = useRef<number>(0)
```

**Why:**
- useRef persists across renders without causing component re-render
- Survives component lifecycle
- Not reset on each render

### Phase 2: Extract setupRealtimeListener outside hook (40 min)

Move function outside useCallback to avoid dependency chain:

```typescript
// ✅ CORRECT - outside the component/hook
function setupRealtimeListener(
  userId: string,
  subscriptionRef: React.MutableRefObject<...>,
  reconnectAttemptsRef: React.MutableRefObject<number>,
  callbacks: { onMessage: (msg) => void }
) {
  // Implementation here
}
```

**Why:**
- Avoids useCallback dependency hell
- Function is stable, not recreated on every render
- Clear parameters instead of closure dependencies

### Phase 3: Ensure Single Subscription (30 min)

Modify useEffect to guarantee exactly one subscription:

```typescript
useEffect(() => {
  if (!userId || !enabled) return

  // Step 1: Cleanup existing subscription first
  if (subscriptionRef.current) {
    subscriptionRef.current()
    subscriptionRef.current = null
    console.log('🧹 Cleaned up previous subscription')
  }

  // Step 2: Load messages
  loadMessages()

  // Step 3: Create EXACTLY ONE new subscription
  setupRealtimeListener(userId, subscriptionRef, reconnectAttemptsRef, {
    onMessage: (change) => handleRealtimeChange(change),
    onError: (error) => handleError(error)
  })

  // Step 4: Cleanup only when unmounting
  return () => {
    if (subscriptionRef.current) {
      subscriptionRef.current()
      subscriptionRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }
}, [userId, enabled]) // Minimal dependencies!
```

### Phase 4: Testing (40 min)

Open 2 browsers side-by-side:

**Test 1: Post Message**
```
1. Browser 1 (User): Type message "Hello from user"
2. Browser 2 (Admin): Should see it appear in 0-1 second
3. Check DevTools Console: Should see "📱 Real-time message received: INSERT"
4. ✅ NO F5 NEEDED
```

**Test 2: Delete Message**
```
1. Browser 2 (Admin): Click delete on user's message
2. Browser 1 (User): Should see message disappear in 0-1 second
3. Check DevTools Console: Should see "📱 Real-time message received: UPDATE"
4. ✅ NO F5 NEEDED
```

**Test 3: Ban User**
```
1. Browser 2 (Admin): Ban the user
2. Browser 1 (User): Should see ban notice INSTANTLY
3. ✅ NO F5 NEEDED
```

**Test 4: Verify Single Subscription**
```
1. Open DevTools Console
2. Look for "🔌 Setting up real-time listener for messages"
3. Should appear ONCE on mount, then NEVER AGAIN
4. Should NOT see multiple setups during normal usage
```

---

## Testing Checklist

**Functional Testing:**
- [ ] Manual test: 2 browsers (User + Admin) open simultaneously
- [ ] Manual test: Post message User → Admin sees instantly (< 1 sec)
- [ ] Manual test: Delete message Admin → User sees instantly (< 1 sec)
- [ ] Manual test: Ban user Admin → User sees ban notification instantly
- [ ] Manual test: Add reaction User → Admin sees reaction instantly
- [ ] Manual test: Multiple rapid messages → All sync without F5

**Console Validation:**
- [ ] DevTools Console: "Setting up listener" appears EXACTLY ONCE on mount
- [ ] DevTools Console: No duplicate/repeated subscription logs
- [ ] DevTools Console: Real-time events logged for each change
- [ ] DevTools Console: Zero error messages

**Code Quality:**
- [ ] npm run lint: 0 warnings
- [ ] npm run build: succeeds
- [ ] TypeScript: 0 errors
- [ ] git status: clean (only modified file = useRealtimeCommunity.ts)

---

## Files to Modify

**Primary:**
- `/src/hooks/useRealtimeCommunity.ts` — Main fix (rewrite with useRef pattern)

**Secondary (no changes, just reference):**
- `/src/lib/supabase-client.ts` — Already correct (consistent channel name)
- `/src/components/user/sections/CommunitySection.tsx` — No changes needed

---

## Estimated Time

| Phase | Duration | Status |
|-------|----------|--------|
| Analysis | 30 min | ✅ DONE |
| Phase 1: useRef | 50 min | 🔄 TODO |
| Phase 2: Extract function | 40 min | 🔄 TODO |
| Phase 3: useEffect fix | 30 min | 🔄 TODO |
| Phase 4: Testing | 40 min | 🔄 TODO |
| **TOTAL** | **3 hours** | 🔄 TODO |

---

## Technical Rationale

### Why useRef instead of useState?

```typescript
// ❌ WRONG - Causes re-render
const [subscription, setSubscription] = useState(null)

// ✅ CORRECT - No re-render, persists across renders
const subscriptionRef = useRef(null)
```

useState triggers re-render when subscription changes → causes infinite loops
useRef persists without re-rendering → stable reference

### Why extract function outside hook?

```typescript
// ❌ WRONG - Recreated every render due to dependency chain
const setupRealtimeListener = useCallback(() => {...}, [dep1, dep2, dep3])

// ✅ CORRECT - Stable function, no recreation
function setupRealtimeListener(userId, subscriptionRef, callbacks) {...}
```

Dependencies of useCallback can change → function recreated → useEffect re-runs
Extracting avoids closure dependencies → function is truly stable

### Why cleanup first?

```typescript
// ✅ CORRECT - Guarantee single subscription
if (subscriptionRef.current) {
  subscriptionRef.current()  // Unsubscribe old
  subscriptionRef.current = null
}
setupRealtimeListener()  // Create new
```

If we don't cleanup old subscription first, multiple subscriptions can coexist
Cleanup first → guarantees exactly one active subscription

---

## Success Metrics

After this story is complete:

✅ Real-time sync works between Admin and User without page refresh
✅ Messages, deletes, bans, reactions all sync instantly
✅ No console errors or warnings
✅ Console shows clean subscription lifecycle (1 setup, 1 cleanup)
✅ All unit tests pass
✅ Linting passes with 0 warnings

---

## Change Log

**2026-03-04 - Story Created**
- Initial analysis complete
- Root causes documented
- Implementation plan defined
- Status: Draft → Ready for @po validation
