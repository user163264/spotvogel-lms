# Git Repository Setup Guide

This guide provides step-by-step instructions for initializing our Git repository and setting up the GitHub project.

## 1. Initialize the Git Repository

Open a terminal and navigate to the project directory:

```bash
cd /Users/admin/Documents/lms-system
```

Initialize the Git repository:

```bash
git init
```

## 2. Make the Initial Commit

Stage all files:

```bash
git add .
```

Make the initial commit:

```bash
git commit -m "Initial commit: Project structure and GitHub configuration"
```

## 3. Set Up Branch Structure

Create and switch to the develop branch:

```bash
git checkout -b develop
```

## 4. Connect to GitHub

First, create a new repository on GitHub named "lms-system" under the "spotvogel-team" organization.

Then connect your local repository to GitHub:

```bash
git remote add origin https://github.com/spotvogel-team/lms-system.git
```

Push both branches to GitHub:

```bash
# Push main branch
git checkout main
git push -u origin main

# Push develop branch
git checkout develop
git push -u origin develop
```

## 5. Branch Protection Rules

On GitHub, set up branch protection rules:

1. Go to repository Settings > Branches
2. Add rule for "main" branch:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Require branches to be up to date before merging
3. Add similar but slightly less strict rules for "develop" branch

## 6. Team Access

Invite team members to the repository with appropriate roles:
- Admin: Frank De Poorter
- Write: Finny Frontend, Sarah Server, Alex Ex

## 7. Project Board Setup

Create a project board with the following columns:
- Backlog
- To Do
- In Progress
- Review
- Done

## 8. Labels

Create the following labels for issues and pull requests:
- frontend
- backend
- exercise-generation
- bug
- enhancement
- documentation
- priority-high
- priority-medium
- priority-low

## 9. Create Initial Issues

Create initial issues for each team member to get started:
- Frontend: "Set up React project structure"
- Backend: "Create Express server and MongoDB connection"
- Exercise Generation: "Design AI exercise template structure"
- Debugging: "Set up continuous integration pipeline"

## 10. Workflow for Team Members

Each team member should follow this workflow:

1. Create a feature branch from develop:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Work on the feature and commit changes:
   ```bash
   git add .
   git commit -m "feat(area): description of changes"
   ```

3. Push the feature branch to GitHub:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. Create a Pull Request to merge into develop

5. After review and approval, merge the PR
