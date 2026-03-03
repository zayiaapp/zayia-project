# 🚀 ZAYIA Platform - Roadmap de Epics e Stories

**Status:** Draft → Ready → InProgress → Done
**Total Epics:** 7
**Total Stories:** 42
**Estimativa:** ~180 pontos

---

## 📋 ÍNDICE DE EPICS

1. [EPIC-001: Backend Foundation](#epic-001-backend-foundation) (7 stories)
2. [EPIC-002: Admin Dashboard](#epic-002-admin-dashboard) (6 stories)
3. [EPIC-003: User Dashboard](#epic-003-user-dashboard) (5 stories)
4. [EPIC-004: Gamification System](#epic-004-gamification-system) (6 stories)
5. [EPIC-005: Community & Moderation](#epic-005-community--moderation) (5 stories)
6. [EPIC-006: Notifications & Automation](#epic-006-notifications--automation) (4 stories)
7. [EPIC-007: Integrations & Deployment](#epic-007-integrations--deployment) (9 stories)

---

## EPIC-001: Backend Foundation

**Epic Lead:** @data-engineer + @dev
**Complexity:** HIGH (42 pontos)
**Priority:** 🔴 CRITICAL
**Duration:** Weeks 1-2

Backend infrastructure, database schema, auth, real-time listeners, API functions.

### STORY-001.001: Create Supabase Tables & Schema
**Complexity:** 8 pontos | **Status:** Draft
**Owner:** @data-engineer
**Depends on:** None

**Description:**
Create 23 Supabase tables with all fields, constraints, indexes, RLS policies, and triggers. Foundation for entire app.

**Acceptance Criteria:**
- [ ] 23 tables created with correct field types
- [ ] All FK constraints implemented
- [ ] All unique constraints in place
- [ ] RLS policies for auth/public access
- [ ] Indexes on frequently queried columns
- [ ] Soft delete patterns (deleted_at, deleted_by_admin)
- [ ] Audit triggers (created_at, updated_at)
- [ ] npm run build succeeds with 0 TypeScript errors

**Subtasks:**
1. profiles + auth tables
2. challenges & categories tables
3. badges & medals tables
4. community tables (messages, reactions, bans, reports)
5. subscription & ranking tables
6. notification tables
7. compliance & company tables
8. RLS policies for all tables
9. Indexes and triggers
10. Test queries and migrations

**Acceptance Criteria Met:** ✅

---

### STORY-001.002: Implement Real-Time Listeners
**Complexity:** 6 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Create Supabase realtime listeners for 25+ events (challenges, points, bans, messages, etc). Foundation for synchronization.

**Acceptance Criteria:**
- [ ] onChallengeCompleted() listener
- [ ] onPointsUpdated() listener
- [ ] onLevelUp() listener
- [ ] onMedalEarned() listener
- [ ] onMessageSent() listener
- [ ] onReactionAdded() listener
- [ ] onMessageDeleted() listener
- [ ] onUserBanned() listener
- [ ] onCategoryUpdated() listener
- [ ] onChallengeUpdated() listener
- [ ] All listeners cleanup on unmount
- [ ] No memory leaks (test with React DevTools)
- [ ] Works across browser tabs

**Subtasks:**
1. Challenge completion listener
2. Points & level listeners
3. Medal listener
4. Community listeners (messages, reactions, bans)
5. Admin listeners (categories, challenges, plans)
6. Cleanup/unsubscribe patterns
7. Memory leak tests

---

### STORY-001.003: Implement Community API Functions
**Complexity:** 5 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Implement 15+ API functions in supabase-client.ts for community (post message, add reaction, report, ban, etc).

**Acceptance Criteria:**
- [ ] postMessage(content, user_id)
- [ ] getMessages(limit, offset)
- [ ] addReaction(messageId, emoji, user_id)
- [ ] removeReaction(messageId, emoji, user_id)
- [ ] reportMessage(messageId, reason, description)
- [ ] deleteMessage(messageId) - soft delete
- [ ] banUser(userId, duration, reason)
- [ ] unbanUser(userId)
- [ ] getUserBanStatus(userId)
- [ ] getRules()
- [ ] updateRules(content)
- [ ] All functions have error handling
- [ ] All functions return typed responses

**Subtasks:**
1. Message CRUD functions
2. Reaction functions
3. Report functions
4. Ban functions
5. Rules functions
6. Type definitions for all functions
7. Error handling & validation

---

### STORY-001.004: Implement Challenges API Functions
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Implement 10+ API functions for challenges (complete challenge, get challenges, etc).

**Acceptance Criteria:**
- [ ] completeChallenge(challengeId, userId, proofUrl)
- [ ] getChallengesToday() - returns 4 challenges
- [ ] getChallengesByCategory(categoryId)
- [ ] getAllChallenges()
- [ ] getChallengeDetails(challengeId)
- [ ] All functions validate user permissions
- [ ] All functions return typed responses

**Subtasks:**
1. Challenge completion function
2. Get challenges functions
3. Proof upload/validation
4. Permission checks

---

### STORY-001.005: Implement Ranking API Functions
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Implement 5+ API functions for rankings (get ranking, user position, winners, etc).

**Acceptance Criteria:**
- [ ] getMonthlyRanking(month, year, limit)
- [ ] getUserRankingPosition(userId, month, year)
- [ ] getTopThree() - returns 1st, 2nd, 3rd
- [ ] getMonthlyWinners(month, year)
- [ ] calculateRankingScore() - realtime calculation

**Subtasks:**
1. Ranking query functions
2. TOP 3 calculation
3. User position function
4. Monthly winners function

---

### STORY-001.006: Implement Badges/Medals API Functions
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Implement 8+ API functions for badges and medals (earn badge, get badges, unlock medal, etc).

**Acceptance Criteria:**
- [ ] checkAndUnlockMedals(userId)
- [ ] getUserBadges(userId)
- [ ] getUserMedalsByCategory(userId, categoryId)
- [ ] getGlobalMedals()
- [ ] getMedalsByCategory(categoryId)
- [ ] getLevelRequirements()
- [ ] calculateNextLevel(currentPoints)
- [ ] All functions validate requirements

**Subtasks:**
1. Medal unlock logic
2. Badge retrieval functions
3. Level calculation functions
4. Requirement validation

---

### STORY-001.007: Implement Subscription API Functions
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Implement 5+ API functions for subscriptions (get plans, create subscription, cancel, etc).

**Acceptance Criteria:**
- [ ] getAllPlans()
- [ ] getUserSubscription(userId)
- [ ] createSubscription(userId, planId, stripeId)
- [ ] updateSubscription(subscriptionId, planId)
- [ ] cancelSubscription(subscriptionId)
- [ ] All functions handle Stripe integration

**Subtasks:**
1. Plans retrieval
2. Subscription CRUD
3. Stripe API integration
4. Error handling

---

## EPIC-002: Admin Dashboard

**Epic Lead:** @dev
**Complexity:** HIGH (28 pontos)
**Priority:** 🔴 CRITICAL
**Duration:** Weeks 2-3

11 admin tabs with all features (dashboard, guerreiras, quiz, community, desafios, medalhas, prêmios, notificações, assinaturas, compliance, integrações).

### STORY-002.001: Admin Dashboard Tab
**Complexity:** 5 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001, STORY-001.003

**Description:**
Create admin Dashboard tab with real-time statistics (revenue, users, churn, graph, challenges today).

**Acceptance Criteria:**
- [ ] 4 stats cards (revenue, users, cancellations, churn)
- [ ] Revenue vs Users combo chart
- [ ] Challenges completed today (updates every 1 min)
- [ ] Date filters (daily/monthly)
- [ ] Export CSV button
- [ ] Real-time updates via Supabase listeners
- [ ] Responsive on mobile

**Subtasks:**
1. Stats cards component
2. Revenue/Users chart (using recharts)
3. Challenges today list
4. Date filter logic
5. CSV export function
6. Real-time listeners
7. Mobile responsiveness

---

### STORY-002.002: Admin Guerreiras Tab (Users Management)
**Complexity:** 6 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Create admin Guerreiras tab with CRUD (create, edit, view, deactivate, delete) for users.

**Acceptance Criteria:**
- [ ] List all guerreiras with search + filters
- [ ] "Criar Guerreira" modal with full form
- [ ] View details modal (profile, activity, payments)
- [ ] Edit user data modal
- [ ] Deactivate user (blocks login)
- [ ] Delete user (permanent, soft delete)
- [ ] Email sent on creation (password reset link)
- [ ] Real-time updates

**Subtasks:**
1. Guerreiras list component
2. Search & filter logic
3. Create user modal + form validation
4. View details modal (3 tabs)
5. Edit modal
6. Deactivate/delete actions
7. Email service integration
8. Real-time listener

---

### STORY-002.003: Admin Quiz Tab
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Create admin Quiz tab for managing 21 onboarding questions (CRUD).

**Acceptance Criteria:**
- [ ] List all 21 questions
- [ ] Create new question modal
- [ ] Edit question modal
- [ ] Delete question (with confirmation)
- [ ] Question types (multiple choice, category selector)
- [ ] Dynamic alternatives (add/remove)
- [ ] Only 1 "final" question allowed
- [ ] Counter shows X/21 questions

**Subtasks:**
1. Quiz list component
2. Create question modal
3. Edit question modal
4. Delete confirmation
5. Alternative management (dynamic)
6. Question type validation
7. Final question uniqueness validation

---

### STORY-002.004: Admin Community Tab
**Complexity:** 5 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001, STORY-001.003

**Description:**
Create admin Community tab for moderation (delete messages, ban users, edit rules, real-time chat).

**Acceptance Criteria:**
- [ ] Real-time chat display (all messages)
- [ ] Edit rules modal (save + sync real-time)
- [ ] Delete message with reason modal
- [ ] Ban user modal (1d/7d/permanent)
- [ ] Ban auto-expires (1d/7d)
- [ ] Real-time sync (messages, deletions, bans)
- [ ] Rules block at top

**Subtasks:**
1. Real-time chat component
2. Edit rules modal
3. Delete message action
4. Ban user action + duration
5. Ban expiration logic
6. Real-time listeners (messages, bans)
7. Rules sync

---

### STORY-002.005: Admin Desafios Tab
**Complexity:** 6 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Create admin Desafios tab (categories + challenges CRUD). Metrics on metrics tab.

**Acceptance Criteria:**
- [ ] Metrics sub-tab (cards + ranking)
- [ ] Categories sub-tab (grid of 7)
- [ ] Edit category modal
- [ ] Delete category (with confirmation)
- [ ] View desafios of category (list 120)
- [ ] Create challenge modal
- [ ] Edit challenge modal
- [ ] Delete challenge modal
- [ ] Duplicate challenge button
- [ ] Real-time sync

**Subtasks:**
1. Metrics tab (stats cards + chart)
2. Categories tab (grid display)
3. Edit category modal
4. View desafios list (120 challenges)
5. Create challenge modal
6. Edit challenge modal
7. Duplicate button
8. Delete confirmation
9. Real-time listeners

---

### STORY-002.006: Admin Medalhas & Prêmios Tabs
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Create admin Medalhas & Prêmios tabs for medal config, levels, prize values, management.

**Acceptance Criteria:**
- [ ] Medalhas: Edit medals by category (4 per cat)
- [ ] Medalhas: Edit 10 levels (0-9)
- [ ] Prêmios: Edit prize values (1st/2nd/3rd)
- [ ] Prêmios: TOP 3 ranking display
- [ ] Prêmios: Manage prize (mark as paid)
- [ ] Prêmios: Histórico de vencedoras
- [ ] Prêmios: Analytics (chart, summary)
- [ ] Real-time sync

**Subtasks:**
1. Medalhas carousels (edit modals)
2. Levels edit modals
3. Prize values form
4. TOP 3 management cards
5. Mark as paid modal
6. Histórico table
7. Analytics components
8. Real-time listeners

---

## EPIC-003: User Dashboard

**Epic Lead:** @dev
**Complexity:** MEDIUM (22 pontos)
**Priority:** 🔴 CRITICAL
**Duration:** Weeks 2-3

8 user tabs with all features (dashboard, ranking, desafios, medalhas, comunidade, assinatura, perfil, configurações).

### STORY-003.001: User Dashboard Tab
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.004, STORY-001.005

**Description:**
Create user Dashboard tab (level progress, 4 desafios today, streak, próximos níveis, frase do dia).

**Acceptance Criteria:**
- [ ] Level card with progress bar (0-100%)
- [ ] Progress today card (X de 4)
- [ ] Streak card (dias consecutivos)
- [ ] Próximos níveis (2-3 future levels)
- [ ] Daily phrase (personalized)
- [ ] 4 challenge cards (today's challenges)
- [ ] Real-time updates (points, level, progress)
- [ ] Mobile responsive

**Subtasks:**
1. Level card component
2. Progress bar component
3. Streak component
4. Next levels component
5. Daily phrase generator
6. Challenge cards (4)
7. Real-time listeners (points, level, challenges)
8. Responsive styling

---

### STORY-003.002: User Ranking Tab
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.005

**Description:**
Create user Ranking tab (minha posição, TOP 3 com prêmios, ranking completo).

**Acceptance Criteria:**
- [ ] Minha posição card
- [ ] TOP 3 vencedoras cards (with prizes)
- [ ] Ranking completo table (418 users)
- [ ] Real-time updates (position, points)
- [ ] Polling every 1-2 minutes
- [ ] Destaque na tabela (user's row)
- [ ] Paginação (20 por página)

**Subtasks:**
1. Minha posição component
2. TOP 3 cards component
3. Ranking table component
4. Real-time listener (TOP 3 changes)
5. Polling logic (1-2 min)
6. Pagination component
7. Sorting logic

---

### STORY-003.003: User Desafios Tab
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.004

**Description:**
Create user Desafios tab (4 desafios hoje + categorias com progresso).

**Acceptance Criteria:**
- [ ] Desafios de Hoje sub-tab (4 challenges)
- [ ] Challenge modal (description, timer 60s, photo upload)
- [ ] Categorias sub-tab (1 active, 6 blocked)
- [ ] Progress bar per category (X/120)
- [ ] Unlock requisito (complete 120)
- [ ] Real-time updates (new categories)
- [ ] Photo validation before submit

**Subtasks:**
1. Desafios hoje tab + cards
2. Challenge detail modal
3. Timer logic (60 seconds)
4. Photo upload + preview
5. Submit validation
6. Categorias tab + grid
7. Progress bar component
8. Unlock logic
9. Real-time listeners

---

### STORY-003.004: User Medalhas Tab
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.006

**Description:**
Create user Medalhas tab (9 carousels: 1 níveis + 7 categorias + 1 global).

**Acceptance Criteria:**
- [ ] Níveis carousel (0-9 levels)
- [ ] 7 categoria carousels (4 medals each)
- [ ] Global medals carousel (5 medals)
- [ ] Conquistada vs. faltando status
- [ ] Confete animation on new medal
- [ ] Real-time updates (new medals)
- [ ] Responsive carousel (swipe/buttons)

**Subtasks:**
1. Carousel component (reusable)
2. Medal card component
3. Níveis carousel data
4. Categoria carousels data (7)
5. Global medals data
6. Status logic (earned vs. pending)
7. Confete animation
8. Real-time listener (medal earned)
9. Swipe/nav logic

---

### STORY-003.005: User Comunidade Tab
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.003

**Description:**
Create user Comunidade tab (real-time chat, mentions, reactions, regras, ban handling).

**Acceptance Criteria:**
- [ ] Chat display (real-time messages)
- [ ] Send message input
- [ ] Mentions (@name auto-complete)
- [ ] Reply to message feature
- [ ] Emoji reactions (5: ❤️🔥💪✨🙏)
- [ ] Rules modal
- [ ] Ban handling (field disabled)
- [ ] Real-time sync (messages, reactions, bans)
- [ ] Auto-scroll to new messages

**Subtasks:**
1. Chat display component
2. Message list (real-time)
3. Input field + send
4. Mentions feature (autocomplete)
5. Reply feature
6. Emoji reactions (5 emojis)
7. Rules modal
8. Ban status check
9. Real-time listeners (messages, reactions, bans)
10. Auto-scroll logic

---

## EPIC-004: Gamification System

**Epic Lead:** @dev
**Complexity:** MEDIUM (18 pontos)
**Priority:** 🟠 HIGH
**Duration:** Week 3-4

Challenges, medals, levels, points, badges system.

### STORY-004.001: Challenge Completion & Points
**Complexity:** 5 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.004, STORY-003.001

**Description:**
Implement challenge completion flow (timer, photo proof, validate, award points, real-time).

**Acceptance Criteria:**
- [ ] 60-second timer (non-bypassable)
- [ ] Photo upload (PNG, JPG, WEBP, max 5MB)
- [ ] Compress photo before upload
- [ ] Upload to Supabase Storage
- [ ] Award points (10 or 25)
- [ ] Update total points immediately
- [ ] Real-time sync (dashboard, ranking, medals)
- [ ] Modal closes + notification
- [ ] Confete animation

**Subtasks:**
1. Timer logic (60 seconds)
2. Photo input validation
3. Photo compression
4. Photo upload (Supabase storage)
5. Points calculation
6. Update profiles.points
7. Real-time listeners trigger
8. Dashboard updates
9. Confete animation
10. Notification toast

---

### STORY-004.002: Level Progression System
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.006, STORY-004.001

**Description:**
Implement automatic level progression (calculate next level, award bonus, animate).

**Acceptance Criteria:**
- [ ] Check: points >= nextLevelRequirement
- [ ] Update profiles.level automatically
- [ ] Award level-up bonus (if exists)
- [ ] Update profiles.points with bonus
- [ ] Real-time sync (dashboard, medals, ranking)
- [ ] Level-up notification
- [ ] Confete + celebration animation
- [ ] Next level requisite updates

**Subtasks:**
1. Level requirement logic
2. Auto-level-up check
3. Bonus point calculation
4. Update profiles.level
5. Update profiles.points
6. Real-time listeners
7. Notification
8. Animation component
9. Dashboard update

---

### STORY-004.003: Medal/Badge System (By Category)
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.006, STORY-004.001

**Description:**
Implement category medals (4 per category: Iniciante, Praticante, Mestre, Domadora).

**Acceptance Criteria:**
- [ ] Check challenge count per category
- [ ] Unlock Iniciante (1 challenge)
- [ ] Unlock Praticante (30 challenges)
- [ ] Unlock Mestre (90 challenges)
- [ ] Unlock Domadora (120 challenges - 100%)
- [ ] Award points for each medal
- [ ] Real-time sync (medals tab)
- [ ] Confete animation
- [ ] Pop-up notification

**Subtasks:**
1. Challenge count per category
2. Medal requirement logic
3. Auto-unlock check
4. Award medal points
5. Insert user_earned_badges
6. Real-time listener
7. Medals tab update
8. Pop-up modal
9. Confete animation

---

### STORY-004.004: Global Medals System
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.006, STORY-004.001

**Description:**
Implement 5 global medals (based on total challenges, points, etc).

**Acceptance Criteria:**
- [ ] Primeira Vitória (1 challenge)
- [ ] Em Ascensão (20 challenges)
- [ ] Persistência (50 challenges)
- [ ] Domadora Global (100 challenges)
- [ ] Lenda (200 challenges - max)
- [ ] Award bonus points
- [ ] Real-time sync
- [ ] Confete animation

**Subtasks:**
1. Global medal requirements
2. Total challenge count logic
3. Auto-unlock check
4. Award medals
5. Real-time listeners
6. Confete animation

---

### STORY-004.005: Streak System (Consecutive Days)
**Complexity:** 2 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-004.001

**Description:**
Implement streak counter (consecutive days with challenges completed).

**Acceptance Criteria:**
- [ ] Track last login date
- [ ] If logged in today: increment streak
- [ ] If missed day: reset streak
- [ ] Display in dashboard
- [ ] Real-time updates
- [ ] Milestone notifications (7, 14, 30 days)

**Subtasks:**
1. Streak logic
2. Daily check
3. Increment/reset logic
4. Dashboard display
5. Real-time listener
6. Milestone notifications

---

### STORY-004.006: Points & Ranking Calculations
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.005, STORY-004.001

**Description:**
Implement real-time ranking calculation (sort by points, TOP 3, monthly reset).

**Acceptance Criteria:**
- [ ] Calculate TOP 3 by points
- [ ] Monthly reset (reset points, keep history)
- [ ] Archive previous month rankings
- [ ] Real-time TOP 3 updates
- [ ] Polling for full ranking (1-2 min OK)
- [ ] Prêmios appear on TOP 3

**Subtasks:**
1. TOP 3 calculation
2. Monthly reset scheduler
3. Archive logic
4. Real-time listeners (TOP 3)
5. Polling for full ranking
6. Ranking view updates

---

## EPIC-005: Community & Moderation

**Epic Lead:** @dev
**Complexity:** MEDIUM (16 pontos)
**Priority:** 🟠 HIGH
**Duration:** Week 4

Real-time community chat, reactions, reporting, bans, rules.

### STORY-005.001: Real-Time Community Chat
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.003, STORY-003.005

**Description:**
Implement real-time community chat (messages, reactions, deletions).

**Acceptance Criteria:**
- [ ] Send message (max 1000 chars)
- [ ] Display all messages (infinite scroll or pagination)
- [ ] Timestamps on each message
- [ ] User avatar + level badge
- [ ] Mentions (@user links)
- [ ] Reply feature (visual indicator)
- [ ] Real-time new messages (Supabase broadcast)
- [ ] Real-time deletions (show "removed")
- [ ] Auto-scroll to new messages
- [ ] Emoji picker for reactions

**Subtasks:**
1. Message input field
2. Send message function
3. Message list component
4. Real-time listener (new messages)
5. Avatar + level display
6. Mentions parsing
7. Reply feature
8. Timestamp formatting
9. Auto-scroll logic
10. Deleted message handling

---

### STORY-005.002: Emoji Reactions System
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-005.001

**Description:**
Implement emoji reactions (5 emojis: ❤️🔥💪✨🙏) with real-time sync.

**Acceptance Criteria:**
- [ ] 5 emoji options available
- [ ] Add reaction to message
- [ ] Remove own reaction
- [ ] Count reactions
- [ ] Hover shows who reacted
- [ ] Real-time sync (all users)
- [ ] Reactions persist in DB
- [ ] Max 1 reaction per emoji per user

**Subtasks:**
1. Emoji picker component
2. Add reaction function
3. Remove reaction function
4. Reaction counter
5. Tooltip (who reacted)
6. Real-time listener
7. Reaction persistence
8. Uniqueness constraint

---

### STORY-005.003: Message Reporting & Moderation
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-005.001

**Description:**
Implement message reporting (reasons) and admin moderation (delete + notify).

**Acceptance Criteria:**
- [ ] Report button on messages
- [ ] Report reasons (5 types)
- [ ] Report description (text)
- [ ] Reports stored in DB
- [ ] Admin can view all reports
- [ ] Admin delete message with reason
- [ ] Deleted message shows "removed by admin"
- [ ] Real-time sync for all users
- [ ] User notified of deletion

**Subtasks:**
1. Report button + modal
2. Report reasons enum
3. Report storage
4. Admin reports list
5. Delete message action
6. Soft delete logic
7. Real-time deletion sync
8. Notification to user

---

### STORY-005.004: User Ban System (Temporary & Permanent)
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Implement user ban system (1 day, 7 days, permanent) with auto-expiry and real-time sync.

**Acceptance Criteria:**
- [ ] Ban options (1d, 7d, permanent)
- [ ] Ban reason (text)
- [ ] Ban expiry calculation
- [ ] Ban auto-expiry (1d/7d)
- [ ] Field disabled when banned
- [ ] Banned user notified
- [ ] Real-time field disable
- [ ] Ban status check on message send
- [ ] Unbanned notification
- [ ] Ban history in DB

**Subtasks:**
1. Ban modal + duration select
2. Ban reason input
3. Ban expiry calculation
4. Ban storage (profiles + bans table)
5. Auto-expiry scheduler
6. Check ban status on send
7. Field disable logic
8. Real-time status sync
9. Notification on ban
10. Notification on unban

---

### STORY-005.005: Community Rules Management
**Complexity:** 2 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.003

**Description:**
Implement community rules editor (admin) and viewer (user) with real-time sync.

**Acceptance Criteria:**
- [ ] Admin: Edit rules (rich text)
- [ ] Admin: Save rules
- [ ] User: View rules modal
- [ ] User: Rules always current version
- [ ] Real-time sync (when rules updated)
- [ ] Rules appear in community tab

**Subtasks:**
1. Rules editor modal (admin)
2. Rich text editor
3. Save function
4. Rules viewer modal (user)
5. Real-time listener
6. Cache invalidation

---

## EPIC-006: Notifications & Automation

**Epic Lead:** @dev
**Complexity:** MEDIUM (14 pontos)
**Priority:** 🟠 HIGH
**Duration:** Week 4

Notification templates, scheduling, Firebase integration, admin tests.

### STORY-006.001: Notification Templates Management
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Implement 15 motivation templates (8 morning, 7 evening) + 7 absence templates.

**Acceptance Criteria:**
- [ ] 8 morning templates
- [ ] 7 evening templates
- [ ] 7 absence templates (1d, 2d... 7d)
- [ ] Edit each template (admin)
- [ ] Variable insertion ({user_name}, {points}, etc)
- [ ] Template rotation
- [ ] Save to DB
- [ ] Real-time sync

**Subtasks:**
1. Template data structure
2. CRUD templates (admin)
3. Edit modal
4. Variable parsing
5. Template storage
6. Template rotation logic
7. Real-time listener

---

### STORY-006.002: Firebase Push Notifications Integration
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001, STORY-006.001

**Description:**
Integrate Firebase Cloud Messaging (FCM) for push notifications.

**Acceptance Criteria:**
- [ ] Firebase SDK setup
- [ ] Service worker for FCM
- [ ] Device token registration
- [ ] Send notification (backend)
- [ ] Display notification (frontend)
- [ ] Notification permission request
- [ ] Handle notification click
- [ ] Offline handling

**Subtasks:**
1. Firebase config
2. FCM service worker
3. Token registration
4. Backend send function
5. Frontend listener
6. Notification display
7. Permission request
8. Click handler

---

### STORY-006.003: Notification Scheduler
**Complexity:** 4 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-006.001, STORY-006.002

**Description:**
Implement automatic notification scheduling (morning, evening, absence).

**Acceptance Criteria:**
- [ ] Cron job morning (6:00 AM default)
- [ ] Cron job evening (8:00 PM default)
- [ ] Cron job absence (after 24h no login)
- [ ] Admin configurable times
- [ ] Select random template
- [ ] Send to all users (notif enabled)
- [ ] Log notification sent
- [ ] Real-time listener

**Subtasks:**
1. Node-cron scheduler
2. Morning job (select template + send)
3. Evening job
4. Absence job (24h, 2d, 3d... 7d)
5. Admin time config
6. Template selection (random)
7. Bulk send via FCM
8. Logging
9. Real-time trigger

---

### STORY-006.004: Admin Notification Testing
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-006.002

**Description:**
Implement admin test notification feature (send to all users immediately).

**Acceptance Criteria:**
- [ ] Admin input test message
- [ ] Send button
- [ ] Sends to ALL users immediately
- [ ] Log test in history
- [ ] Confirmation message
- [ ] All users receive push + notification

**Subtasks:**
1. Test input field
2. Send function (all users)
3. FCM bulk send
4. Logging
5. Notification toast
6. History storage

---

## EPIC-007: Integrations & Deployment

**Epic Lead:** @devops + @dev
**Complexity:** HIGH (24 pontos)
**Priority:** 🟠 HIGH
**Duration:** Week 5

Stripe payments, email service, compliance, integrations, deployment.

### STORY-007.001: Subscription Plans Management
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Implement 3 subscription plans (Trial, Básico, Premium) with admin CRUD.

**Acceptance Criteria:**
- [ ] Trial plan (30 days free)
- [ ] Básico plan (R$ 19.97/month)
- [ ] Premium plan (R$ 29.97/month)
- [ ] Admin: Create plan modal
- [ ] Admin: Edit plan modal
- [ ] Admin: Delete plan (soft)
- [ ] User: View available plans
- [ ] Real-time sync

**Subtasks:**
1. Plans data structure
2. Admin CRUD modals
3. Plan validation
4. User plans view
5. Real-time listener
6. Stripe integration prep

---

### STORY-007.002: Stripe Payment Integration
**Complexity:** 5 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-007.001

**Description:**
Integrate Stripe for payment processing (checkout, webhooks, invoice).

**Acceptance Criteria:**
- [ ] Stripe SDK setup
- [ ] Payment checkout flow
- [ ] Successful payment webhook
- [ ] Failed payment webhook
- [ ] Invoice generation
- [ ] Subscription renewal
- [ ] Payment history in DB
- [ ] User: Payment method update

**Subtasks:**
1. Stripe API setup
2. Checkout session creation
3. Webhook handler (success)
4. Webhook handler (failure)
5. Payment status update
6. Invoice generation
7. Renewal logic
8. Payment method update form
9. Error handling

---

### STORY-007.003: User Subscription Management
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-007.002

**Description:**
Implement user subscription view (current plan, method, renewal date, history).

**Acceptance Criteria:**
- [ ] View current plan
- [ ] View payment method
- [ ] View renewal date
- [ ] View invoice history (table)
- [ ] Download invoice (PDF)
- [ ] Change plan (upgrade/downgrade)
- [ ] Cancel subscription
- [ ] Pause subscription
- [ ] Real-time updates

**Subtasks:**
1. Subscription view component
2. Current plan display
3. Payment method display
4. Renewal date calculation
5. Invoice history table
6. PDF download
7. Plan change flow
8. Cancel flow
9. Pause flow
10. Real-time listener

---

### STORY-007.004: Compliance & Legal Documents
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Implement compliance features (company info, privacy policy, terms of use, LGPD export).

**Acceptance Criteria:**
- [ ] Admin: Edit company info
- [ ] Admin: Edit privacy policy
- [ ] Admin: Edit terms of use
- [ ] User: View company info
- [ ] User: View privacy policy
- [ ] User: View terms of use
- [ ] User: Export data (LGPD) as PDF
- [ ] Real-time sync
- [ ] Version tracking

**Subtasks:**
1. Company info form
2. Policy editor (rich text)
3. Policy viewer modal
4. Version management
5. Real-time listener
6. LGPD export function (PDF)
7. Data aggregation for export
8. PDF generation

---

### STORY-007.005: Email Notifications Service
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Integrate AWS SES or similar for transactional emails (welcome, password reset, invoice, etc).

**Acceptance Criteria:**
- [ ] Welcome email on signup
- [ ] Password reset email
- [ ] Invoice email
- [ ] Cancellation email
- [ ] Ban notification email
- [ ] Email templates
- [ ] Email logging

**Subtasks:**
1. Email service setup (AWS SES or SendGrid)
2. Email templates
3. Welcome email function
4. Password reset email
5. Invoice email
6. Ban notification email
7. Email logging
8. Error handling

---

### STORY-007.006: Profile Picture Upload to Supabase Storage
**Complexity:** 2 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Implement avatar upload to Supabase Storage with real-time sync.

**Acceptance Criteria:**
- [ ] User: Upload avatar (PNG, JPG, WEBP)
- [ ] Compress image (if > 500px)
- [ ] Upload to storage
- [ ] Update profiles.avatar_url
- [ ] Real-time sync (ranking, community)
- [ ] Avatar display in all tabs
- [ ] Delete option

**Subtasks:**
1. File input component
2. Image compression
3. Supabase storage upload
4. Avatar URL update
5. Real-time listeners
6. Avatar display updates
7. Delete function

---

### STORY-007.007: Admin Dashboard Integrations Tab
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @dev
**Depends on:** STORY-001.001

**Description:**
Create admin Integrações tab (config for Supabase, Firebase, AWS, Stripe, test buttons).

**Acceptance Criteria:**
- [ ] System health status (% OK)
- [ ] Integration status cards (✅/❌)
- [ ] Supabase config form
- [ ] Firebase config form
- [ ] AWS Email config form
- [ ] Stripe config form
- [ ] Test connection button per service
- [ ] Logs export
- [ ] Real-time status

**Subtasks:**
1. Integration status component
2. Config forms (4)
3. Test buttons (4)
4. Health checker functions
5. Status indicator
6. Logs viewer
7. Error handling

---

### STORY-007.008: Database Backups & Disaster Recovery
**Complexity:** 2 pontos | **Status:** Draft
**Owner:** @devops
**Depends on:** STORY-001.001

**Description:**
Setup automated Supabase backups and disaster recovery plan.

**Acceptance Criteria:**
- [ ] Daily backups enabled
- [ ] Backup retention (30 days)
- [ ] Restore test procedure
- [ ] Monitoring alerts
- [ ] Documentation

**Subtasks:**
1. Supabase backup config
2. Automated backup schedule
3. Restore procedure
4. Monitoring setup
5. Alerts config

---

### STORY-007.009: Production Deployment & DevOps
**Complexity:** 3 pontos | **Status:** Draft
**Owner:** @devops
**Depends on:** All stories

**Description:**
Setup production deployment (CI/CD, hosting, monitoring, scaling).

**Acceptance Criteria:**
- [ ] GitHub Actions CI/CD
- [ ] Vercel/Railway deployment
- [ ] SSL certificate
- [ ] Custom domain
- [ ] Environment variables
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring

**Subtasks:**
1. GitHub Actions workflow
2. Build + test + deploy
3. Hosting setup
4. Domain configuration
5. SSL setup
6. Environment variables
7. Error tracking
8. Monitoring tools
9. Scaling plan

---

## 📊 Summary

| Epic | Stories | Complexity | Priority |
|------|---------|-----------|----------|
| 001: Backend Foundation | 7 | HIGH (42 pts) | 🔴 CRITICAL |
| 002: Admin Dashboard | 6 | HIGH (28 pts) | 🔴 CRITICAL |
| 003: User Dashboard | 5 | MEDIUM (22 pts) | 🔴 CRITICAL |
| 004: Gamification | 6 | MEDIUM (18 pts) | 🟠 HIGH |
| 005: Community | 5 | MEDIUM (16 pts) | 🟠 HIGH |
| 006: Notifications | 4 | MEDIUM (14 pts) | 🟠 HIGH |
| 007: Integrations | 9 | HIGH (24 pts) | 🟠 HIGH |
| **TOTAL** | **42** | **164 pts** | **Weeks 1-5** |

---

## 🚦 Recommended Execution Order

1. **Week 1-2:** EPIC-001 (Backend Foundation) - paralleliza
2. **Week 2-3:** EPIC-002 + EPIC-003 (Admin + User Dashboards) - paralleliza
3. **Week 3-4:** EPIC-004 + EPIC-005 (Gamification + Community) - paralleliza
4. **Week 4:** EPIC-006 (Notifications)
5. **Week 5:** EPIC-007 (Integrations & Deployment)

---

**Next Steps:**
1. Move stories to "Ready" status after design review
2. Assign story owners
3. Create detailed acceptance criteria per story
4. Break stories into subtasks with @dev
5. Begin EPIC-001 with @data-engineer + @dev

