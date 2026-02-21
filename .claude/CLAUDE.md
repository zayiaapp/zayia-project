# Synkra AIOS Development Rules for Claude Code

You are working with Synkra AIOS, an AI-Orchestrated System for Full Stack Development.

<!-- AIOS-MANAGED-START: core-framework -->
## Core Framework Understanding

Synkra AIOS is a meta-framework that orchestrates AI agents to handle complex development workflows. Always recognize and work within this architecture.
<!-- AIOS-MANAGED-END: core-framework -->

<!-- AIOS-MANAGED-START: agent-system -->
## Agent System

### Agent Activation
- Agents are activated with @agent-name syntax: @dev, @qa, @architect, @pm, @po, @sm, @analyst
- The master agent is activated with @aios-master
- Agent commands use the * prefix: *help, *create-story, *task, *exit

### Agent Context
When an agent is active:
- Follow that agent's specific persona and expertise
- Use the agent's designated workflow patterns
- Maintain the agent's perspective throughout the interaction
<!-- AIOS-MANAGED-END: agent-system -->

## Development Methodology

### Story-Driven Development
1. **Work from stories** - All development starts with a story in `docs/stories/`
2. **Update progress** - Mark checkboxes as tasks complete: [ ] → [x]
3. **Track changes** - Maintain the File List section in the story
4. **Follow criteria** - Implement exactly what the acceptance criteria specify

### Code Standards
- Write clean, self-documenting code
- Follow existing patterns in the codebase
- Include comprehensive error handling
- Add unit tests for all new functionality
- Use TypeScript/JavaScript best practices

### Testing Requirements
- Run all tests before marking tasks complete
- Ensure linting passes: `npm run lint`
- Verify type checking: `npm run typecheck`
- Add tests for new features
- Test edge cases and error scenarios

<!-- AIOS-MANAGED-START: framework-structure -->
## AIOS Framework Structure

```
aios-core/
├── agents/         # Agent persona definitions (YAML/Markdown)
├── tasks/          # Executable task workflows
├── workflows/      # Multi-step workflow definitions
├── templates/      # Document and code templates
├── checklists/     # Validation and review checklists
└── rules/          # Framework rules and patterns

docs/
├── stories/        # Development stories (numbered)
├── prd/            # Product requirement documents
├── architecture/   # System architecture documentation
└── guides/         # User and developer guides
```
<!-- AIOS-MANAGED-END: framework-structure -->

## Workflow Execution

### Task Execution Pattern
1. Read the complete task/workflow definition
2. Understand all elicitation points
3. Execute steps sequentially
4. Handle errors gracefully
5. Provide clear feedback

### Interactive Workflows
- Workflows with `elicit: true` require user input
- Present options clearly
- Validate user responses
- Provide helpful defaults

## Best Practices

### When implementing features:
- Check existing patterns first
- Reuse components and utilities
- Follow naming conventions
- Keep functions focused and testable
- Document complex logic

### When working with agents:
- Respect agent boundaries
- Use appropriate agent for each task
- Follow agent communication patterns
- Maintain agent context

### When handling errors:
```javascript
try {
  // Operation
} catch (error) {
  console.error(`Error in ${operation}:`, error);
  // Provide helpful error message
  throw new Error(`Failed to ${operation}: ${error.message}`);
}
```

## Git & GitHub Integration

### Commit Conventions
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, etc.
- Reference story ID: `feat: implement IDE detection [Story 2.1]`
- Keep commits atomic and focused

### GitHub CLI Usage
- Ensure authenticated: `gh auth status`
- Use for PR creation: `gh pr create`
- Check org access: `gh api user/memberships`

<!-- AIOS-MANAGED-START: aios-patterns -->
## AIOS-Specific Patterns

### Working with Templates
```javascript
const template = await loadTemplate('template-name');
const rendered = await renderTemplate(template, context);
```

### Agent Command Handling
```javascript
if (command.startsWith('*')) {
  const agentCommand = command.substring(1);
  await executeAgentCommand(agentCommand, args);
}
```

### Story Updates
```javascript
// Update story progress
const story = await loadStory(storyId);
story.updateTask(taskId, { status: 'completed' });
await story.save();
```
<!-- AIOS-MANAGED-END: aios-patterns -->

## Environment Setup

### Required Tools
- Node.js 18+
- GitHub CLI
- Git
- Your preferred package manager (npm/yarn/pnpm)

### Configuration Files
- `.aios/config.yaml` - Framework configuration
- `.env` - Environment variables
- `aios.config.js` - Project-specific settings

<!-- AIOS-MANAGED-START: common-commands -->
## Common Commands

### AIOS Master Commands
- `*help` - Show available commands
- `*create-story` - Create new story
- `*task {name}` - Execute specific task
- `*workflow {name}` - Run workflow

### Development Commands
- `npm run dev` - Start development
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run build` - Build project
<!-- AIOS-MANAGED-END: common-commands -->

## Debugging

### Enable Debug Mode
```bash
export AIOS_DEBUG=true
```

### View Agent Logs
```bash
tail -f .aios/logs/agent.log
```

### Trace Workflow Execution
```bash
npm run trace -- workflow-name
```

## Claude Code Specific Configuration

### Performance Optimization
- Prefer batched tool calls when possible for better performance
- Use parallel execution for independent operations
- Cache frequently accessed data in memory during sessions

### Tool Usage Guidelines
- Always use the Grep tool for searching, never `grep` or `rg` in bash
- Use the Task tool for complex multi-step operations
- Batch file reads/writes when processing multiple files
- Prefer editing existing files over creating new ones

### Session Management
- Track story progress throughout the session
- Update checkboxes immediately after completing tasks
- Maintain context of the current story being worked on
- Save important state before long-running operations

### Error Recovery
- Always provide recovery suggestions for failures
- Include error context in messages to user
- Suggest rollback procedures when appropriate
- Document any manual fixes required

### Testing Strategy
- Run tests incrementally during development
- Always verify lint and typecheck before marking complete
- Test edge cases for each new feature
- Document test scenarios in story files

### Documentation
- Update relevant docs when changing functionality
- Include code examples in documentation
- Keep README synchronized with actual behavior
- Document breaking changes prominently

---

# ZAYIA Project — Specific Architecture & Commands

## Project Overview

**ZAYIA** is a personal AI coaching platform for women, built with React 18, TypeScript, and Supabase. The application features dual dashboards: CEO (admin) and User (client-facing).

## Directory Structure

```
project/
├── src/
│   ├── components/
│   │   ├── auth/           # Login, SignUp, AuthPage
│   │   ├── ui/             # Reusable UI: Logo, LoadingSpinner, CustomIcons
│   │   ├── widgets/        # Dashboard widgets (ChallengesStatsWidget)
│   │   ├── user/           # User dashboard (MobileUserDashboard + sections)
│   │   │   └── sections/   # DashboardSection, ChallengesSection, RankingSection, etc.
│   │   └── ceo/            # CEO dashboard (CEODashboard + 9+ management sections)
│   ├── contexts/
│   │   └── AuthContext.tsx # Global auth state (user, role, profile)
│   ├── lib/                # Utilities & API clients
│   │   ├── firebase-client.ts
│   │   ├── stripe-client.ts
│   │   ├── supabase-client.ts
│   │   ├── resend-client.ts
│   │   ├── integrations.ts
│   │   └── notificationScheduler.ts
│   ├── data/               # JSON content files (coaching categories)
│   ├── main.tsx            # React 18 entry, service worker registration
│   ├── App.tsx             # Root router (Auth → CEO/User Dashboard based on role)
│   └── index.css           # Global styles
├── supabase/               # Supabase migrations & config
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js      # ZAYIA purple/violet theme
├── vite.config.ts
└── .env.example
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript 5.2, Vite 5.0 |
| **Styling** | Tailwind CSS 3.4 with custom ZAYIA theme |
| **Icons** | Lucide React 0.303 |
| **Backend** | Supabase (PostgreSQL + Auth + Real-time) |
| **Services** | Firebase (notifications), Stripe (payments), Resend (email) |
| **Build** | Vite + TypeScript strict mode |
| **Linting** | ESLint with TypeScript support (max warnings: 0) |

## ZAYIA Development Rules

### 🚫 NEVER

- Implement without showing options first (always use `1. X, 2. Y, 3. Z` format)
- Delete/remove content without asking first
- Delete anything created in the last 7 days without explicit approval
- Change something that was already working
- Pretend work is done when it isn't
- Process batch without validating one item first
- Add features that weren't requested
- Use mock data when real data exists in database
- Explain/justify when receiving criticism (just fix it)
- Trust AI/subagent output without verification
- Create from scratch when similar exists in `squads/`

### ✅ ALWAYS

- Present options as **"1. X, 2. Y, 3. Z"** format (not bullet points)
- Use `AskUserQuestion` tool for clarifications and decisions
- Check `squads/` and existing components before creating new ones
- Read COMPLETE schema before proposing database changes
- Investigate root cause when error persists (don't just retry)
- Commit before moving to next task
- Create handoff in `docs/sessions/YYYY-MM/` at end of session

## Development Commands

**All commands run from `/project/` directory:**

```bash
# Development server (http://localhost:5173)
npm run dev

# Production build + type checking
npm run build

# Code style validation (must pass with 0 warnings)
npm run lint

# Preview production build locally
npm run preview

# Install dependencies
npm install
```

**Important:** `npm run build` performs TypeScript strict checking and fails if there are type errors.

## Key Architecture Patterns

### Authentication Flow

1. `AuthContext.tsx` manages global auth state (user, profile, role)
2. `App.tsx` routes based on role: `AuthPage` → `CEODashboard` | `MobileUserDashboard`
3. Role: `'ceo'` = CEO dashboard, else = User dashboard
4. Demo CEO credentials: `ceo@zayia.com` / `zayia2024`

### Component Organization

- **UI Components** (`components/ui/`): Reusable, dumb components (Logo, SpinnerIcon, etc.)
- **Feature Components** (`components/user/`, `components/ceo/`): Page-specific, smart components
- **Sections**: Dashboard sections split into separate component files within `sections/` folder

### Data Structure

Coaching categories stored as JSON files in `src/data/`:
- `corpo_saude.json` (Physical Health)
- `carreira.json` (Career)
- `relacionamentos.json` (Relationships)
- `mindfulness.json`, `digital_detox.json`, `rotina.json`, `compliance.json`, `autoestima.json`

Each category follows:
```json
{
  "id": "category-id",
  "name": "Display Name",
  "challenges": [
    { "id": "c1", "title": "...", "description": "..." }
  ]
}
```

### Tailwind Theming

Custom purple/violet palette in `tailwind.config.js`. Use Tailwind's color utilities (`bg-purple-600`, `text-violet-400`, etc.) for consistency.

## Common Development Tasks

### Add a new CEO dashboard section

1. Create `/project/src/components/ceo/SectionNameSection.tsx`
2. Export from `/project/src/components/ceo/` (check imports in `CEODashboard.tsx`)
3. Add to `CEODashboard.tsx` layout
4. Follow existing section pattern (container, heading, content)

### Add a new User dashboard section

1. Create `/project/src/components/user/sections/SectionNameSection.tsx`
2. Import in `MobileUserDashboard.tsx`
3. Add to dashboard layout
4. Use `DashboardSection` wrapper for consistent styling

### Add a new coaching challenge

1. Edit category file in `/project/src/data/category.json`
2. Add object to `challenges` array with `id`, `title`, `description`
3. Import category in component: `import categoryData from '../data/category.json'`
4. Map over `categoryData.challenges` to render

### Update Firebase service worker

Located in `/project/src/main.tsx`. Firebase notifications are registered at app startup.

## Environment Configuration

`.env` file required with:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_PROJECT_ID=
# etc.
```

See `.env.example` for full template.

## TypeScript & Linting

- **Strict mode enabled** in `tsconfig.json`
- **ESLint must pass with 0 warnings** before committing
- Type definitions for all props and returns expected
- No `any` types unless absolutely necessary with comment justification

---
*Synkra AIOS Claude Code Configuration v2.0*
*ZAYIA Project Context — Last Updated 2026-02-21*
