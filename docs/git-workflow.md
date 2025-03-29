# Git Workflow Guide

This document outlines our team's Git workflow, including branching strategy, commit naming conventions, and the process for submitting and reviewing code changes.

## Table of Contents

1. [Branching Strategy](#branching-strategy)
2. [Commit Message Format](#commit-message-format)
3. [Development Workflow](#development-workflow)
4. [Pull Request Process](#pull-request-process)
5. [Code Review Guidelines](#code-review-guidelines)
6. [Release Process](#release-process)

## Branching Strategy

We follow a modified Git Flow branching strategy:

### Main Branches

- `main` - Production code only, always deployable
- `develop` - Integration branch, contains code for the next release

### Supporting Branches

- `feature/*` - New features and non-emergency bug fixes
- `bugfix/*` - Bug fixes for the upcoming release
- `hotfix/*` - Emergency fixes for production issues
- `release/*` - Preparing for a new production release

## Commit Message Format

We follow the Conventional Commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc; no code change
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding or fixing tests
- `chore`: Changes to build process or auxiliary tools

### Scope:

The scope is optional and indicates the section of the codebase the commit affects (e.g., auth, exercises, templates).

### Examples:

```
feat(auth): implement JWT authentication
fix(templates): resolve issue with template duplication
docs(api): update API documentation with new endpoints
```

## Development Workflow

### Starting a New Feature

1. Update your local repo
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. Create a feature branch
   ```bash
   git checkout -b feature/descriptive-feature-name
   ```

3. Work on your feature, making regular commits

4. Push your branch to GitHub
   ```bash
   git push -u origin feature/descriptive-feature-name
   ```

5. Create a Pull Request to merge into `develop`

### Fixing a Bug

1. For non-urgent bugs, follow the feature workflow but use `bugfix/` prefix
   ```bash
   git checkout -b bugfix/issue-description
   ```

2. For urgent production bugs, branch from `main` and use `hotfix/` prefix
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-issue-description
   ```

## Pull Request Process

1. Create a Pull Request (PR) on GitHub
2. Fill in the PR template with details about your changes
3. Request reviews from at least one team member
4. Address any feedback or issues raised during review
5. Once approved, the PR can be merged

## Code Review Guidelines

### For Authors:

- Keep PRs small and focused on a single concern
- Provide clear descriptions of changes
- Run tests locally before submitting
- Respond to review comments promptly

### For Reviewers:

- Be respectful and constructive
- Check for adherence to coding standards
- Verify that tests are included
- Ensure documentation is updated
- Look for potential edge cases or performance issues

## Release Process

1. Create a release branch from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   ```

2. Make any final version bumps or release-specific changes

3. Create a PR to merge into `main`

4. After the PR is approved and merged:
   ```bash
   git checkout main
   git pull origin main
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

5. Merge changes back to `develop`
   ```bash
   git checkout develop
   git merge main
   git push origin develop
   ```
