# Git Branching Strategy for Spotvogel Team

## Overview

This document outlines our team's Git branching strategy to ensure a smooth, collaborative development process. By following these guidelines, we'll maintain a clean repository history and minimize integration issues.

## Branch Structure

### Core Branches

- **`main`**: Production-ready code
  - Always stable and deployable
  - Protected from direct pushes
  - Only receives merges from `develop` (for releases) and `hotfix/*` branches (for emergency fixes)

- **`develop`**: Integration branch
  - The latest delivered development changes for the next release
  - Where feature branches are merged into
  - Should be relatively stable, passing all tests

### Supporting Branches

- **`feature/*`**: New features or improvements
  - Always branch from: `develop`
  - Always merge back into: `develop`
  - Naming convention: `feature/descriptive-feature-name`

- **`bugfix/*`**: Non-urgent bug fixes
  - Always branch from: `develop`
  - Always merge back into: `develop`
  - Naming convention: `bugfix/issue-short-description`

- **`hotfix/*`**: Urgent fixes for production issues
  - Always branch from: `main`
  - Merge back into: `main` AND `develop`
  - Naming convention: `hotfix/critical-issue-description`

- **`release/*`**: Release preparation
  - Always branch from: `develop`
  - Always merge back into: `main` AND `develop`
  - Naming convention: `release/vX.Y.Z`

## Team Member Responsibilities

### Frank De Poorter (Debugging & Project Oversight)
- Manages the `main` and `release/*` branches
- Reviews and approves pull requests to `main` and `develop`
- Creates and manages `hotfix/*` branches for critical issues
- Ensures proper merging between branches

### Finny Frontend (Frontend Engineer)
- Creates `feature/*` and `bugfix/*` branches for frontend work
- Names branches with prefix: `feature/frontend-...` or `bugfix/frontend-...`
- Documents frontend changes in `work-updates/frontend/`

### Sarah Server (Backend Engineer)
- Creates `feature/*` and `bugfix/*` branches for backend work
- Names branches with prefix: `feature/backend-...` or `bugfix/backend-...`
- Documents backend changes in `work-updates/backend/`

### Alex Ex (AI Exercise Creator)
- Creates `feature/*` and `bugfix/*` branches for exercise generation
- Names branches with prefix: `feature/exercise-...` or `bugfix/exercise-...`
- Documents exercise updates in `work-updates/exercise-generation/`

## Workflow Examples

### Feature Development

```bash
# Start from develop branch
git checkout develop
git pull origin develop

# Create a new feature branch
git checkout -b feature/frontend-login-page

# Make changes, commit, and push
git add .
git commit -m "feat(auth): implement login page design"
git push -u origin feature/frontend-login-page

# Create pull request to merge into develop
# After PR is approved and merged, delete the feature branch
```

### Hotfix Process

```bash
# Start from main branch
git checkout main
git pull origin main

# Create a hotfix branch
git checkout -b hotfix/auth-token-expiration

# Fix the issue, commit, and push
git add .
git commit -m "fix(auth): resolve token expiration issue"
git push -u origin hotfix/auth-token-expiration

# Create PR to merge into main
# After merging to main, also merge to develop
git checkout develop
git pull origin develop
git merge hotfix/auth-token-expiration
git push origin develop
```

## Best Practices

1. **Pull before you push**: Always pull latest changes before pushing
2. **Keep branches short-lived**: Merge feature branches quickly
3. **Descriptive branch names**: Make sure branch names describe what they contain
4. **Atomic commits**: Make small, focused commits with clear messages
5. **Regular integration**: Merge develop into your feature branch regularly to resolve conflicts early
6. **Clean up**: Delete branches after they're merged

## Conflict Resolution

If you encounter merge conflicts:

1. Pull the latest from the branch you're trying to merge with
2. Resolve conflicts locally with clear understanding of both changes
3. If the conflict is complex, involve relevant team members
4. Document the resolution in your merge commit message

By following this branching strategy, we'll maintain a clean, organized codebase that facilitates collaboration across our team.
