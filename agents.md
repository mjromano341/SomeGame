# Agent Rules & Git Workflow

This file contains important rules for AI agents and developers working on this repository. **All agents MUST follow these rules.**

## Git Workflow

### Branch Structure

```
main (production)
  ↑
  └── development (QA/staging)
        ↑
        └── feature/phase-1-foundation
        └── feature/phase-2-game-logic
        └── feature/phase-3-rendering
        └── feature/phase-4-ui
        └── feature/phase-5-events
        └── feature/phase-6-polish
        └── feature/[descriptive-name]
```

### Critical Rules

1. **ALWAYS work on feature branches**
   - NEVER commit directly to `main` or `development`
   - ALL work must be done on feature branches
   - Feature branches MUST branch FROM `development`

2. **Feature branch naming convention**
   - Use format: `feature/phase-X-description` for phases
   - Use format: `feature/descriptive-name` for other features
   - Examples:
     - `feature/phase-1-foundation`
     - `feature/phase-2-game-logic`
     - `feature/add-sound-effects`
     - `feature/fix-timer-bug`

3. **Never delete feature branches**
   - Feature branches are kept for history
   - DO NOT delete branches after merging
   - Keep all branches for reference and rollback capability

4. **Development branch workflow**
   - Feature branches merge INTO `development` after QA passes
   - `development` is the integration branch
   - `development` is the base for all new feature branches
   - When creating a new feature branch, ALWAYS branch from `development`

5. **Main branch workflow**
   - `main` is ONLY for production-ready code
   - ONLY merge `development` → `main` when deploying to production
   - NEVER commit directly to `main`
   - `main` should always be in a deployable state

### Workflow Steps

#### Starting New Work

```bash
# 1. Ensure you're on development and up to date
git checkout development
git pull origin development

# 2. Create and switch to new feature branch
git checkout -b feature/phase-X-description

# 3. Work on feature branch
# ... make changes ...

# 4. Commit changes
git add .
git commit -m "Description of changes"

# 5. Push feature branch
git push origin feature/phase-X-description
```

#### After QA Approval - Merge to Development

```bash
# 1. Ensure feature branch is up to date with development
git checkout feature/phase-X-description
git pull origin development
git merge development
# Resolve any conflicts if needed
git push origin feature/phase-X-description

# 2. Switch to development
git checkout development

# 3. Merge feature branch into development
git merge feature/phase-X-description --no-ff

# 4. Push development
git push origin development

# 5. DO NOT DELETE the feature branch!
# Keep it for history
```

#### Deploying to Production

```bash
# 1. Ensure development is ready
git checkout development
git pull origin development

# 2. Switch to main
git checkout main

# 3. Merge development into main
git merge development --no-ff

# 4. Push main
git push origin main

# 5. Tag the release (optional but recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Commit Message Guidelines

- Use clear, descriptive commit messages
- Format: `[Phase/Feature] Brief description`
- Examples:
  - `[Phase 1] Initialize project structure`
  - `[Phase 2] Implement mine placement logic`
  - `[Bugfix] Fix timer not stopping on game over`
  - `[UI] Add hover effects to cells`

### Branch Protection

- Feature branches: Can be force-pushed (development work)
- Development branch: Should have protection (require PR approval for production merges)
- Main branch: MUST have protection (no direct commits, require PR)

### Agent Instructions

**When creating a new feature branch:**
1. ALWAYS checkout development first
2. ALWAYS pull latest development
3. ALWAYS create feature branch from development
4. Use descriptive branch name following convention

**When completing work:**
1. Commit all changes to feature branch
2. Push feature branch to remote
3. DO NOT merge to development unless explicitly told
4. DO NOT delete any branches
5. Wait for QA approval before merging

**When merging:**
1. Merge feature → development (after QA)
2. Merge development → main (for production)
3. Use `--no-ff` flag to preserve branch history
4. Never force-push to development or main

**When making commits:**
1. Commit related changes together
2. Write clear commit messages
3. Don't commit broken code
4. Test before committing (when possible)

## Project-Specific Rules

### Phase Development

This project follows a phased development approach:
- Phase 1: Foundation
- Phase 2: Game Logic
- Phase 3: Rendering
- Phase 4: User Interface
- Phase 5: Event Handling & Integration
- Phase 6: Polish & Refinement

Each phase should be on its own feature branch: `feature/phase-X-[name]`

### Code Standards

- Follow existing code style
- Write clear, commented code
- Maintain separation of concerns
- Test functionality before marking complete

## Important Reminders

⚠️ **NEVER:**
- Commit directly to `main` or `development`
- Delete feature branches
- Force-push to `development` or `main`
- Skip the feature branch workflow
- Merge without QA approval (unless explicitly instructed)

✅ **ALWAYS:**
- Work on feature branches
- Branch from `development`
- Keep all branches
- Follow the merge workflow
- Write descriptive commit messages

---

**This file must be respected by all AI agents working on this repository.**

