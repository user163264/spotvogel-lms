# GitHub Connection Guide for LMS System

As Frank De Poorter, I've analyzed our current repository setup and prepared these steps to properly connect our local codebase to GitHub. This guide takes into account our existing Git repository and ensures we maintain the integrity of our work.

## Current Status
- Local Git repository is initialized
- No remote repository is configured
- Several files and directories are already in place

## Step 1: Create the GitHub Repository Structure

1. Log in to GitHub using the account: `piet@spotvogel.net`
2. Navigate to: https://github.com/user163264/SPOTVOGEL
3. Create a new repository named `lms-system`:
   - Click "New" repository button
   - Enter "lms-system" as the name
   - Add description: "Teacher-focused LMS to reduce workload for Belgian educators"
   - Select "Private" visibility (recommended for proprietary code)
   - Do NOT initialize with README, .gitignore, or license as we already have these locally
   - Click "Create repository"

## Step 2: Connect Local Repository to GitHub

Open a terminal and run these commands:

```bash
# Navigate to our project directory
cd /Users/admin/Documents/lms-system

# Add the GitHub repository as remote
git remote add origin https://github.com/user163264/SPOTVOGEL/lms-system.git

# Verify remote was added correctly
git remote -v
```

## Step 3: Prepare Local Repository for Push

Let's ensure all our changes are committed:

```bash
# Check current status
git status

# Add any untracked files
git add .

# Commit changes if needed
git commit -m "Project setup: Preparing repository for GitHub"
```

## Step 4: Push to GitHub

```bash
# Push the main branch to GitHub
git push -u origin main

# When prompted for credentials:
# Username: piet@spotvogel.net
# Password: ._Nutella123
```

If the push fails with an error about unrelated histories, try:

```bash
git push -u origin main --force
```

## Step 5: Create and Push Develop Branch

```bash
# Create and switch to develop branch
git checkout -b develop

# Push develop branch to GitHub
git push -u origin develop
```

## Step 6: Set Up Branch Protection Rules on GitHub

1. Go to the GitHub repository page
2. Navigate to Settings → Branches
3. Add branch protection rules for `main` and `develop` branches:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Require branches to be up to date before merging

## Step 7: Invite Team Members

1. Go to Settings → Manage access
2. Click "Invite a collaborator"
3. Add team members with appropriate roles:
   - Finny Frontend
   - Sarah Server
   - Alex Ex

## Step 8: Create Project Board

1. Go to Projects tab
2. Create a new project board with columns:
   - Backlog
   - To Do
   - In Progress
   - Review
   - Done

## Troubleshooting Common Issues

### Authentication Failures
If you encounter authentication issues, try:
- Ensure you're using the correct username and password
- Consider creating a Personal Access Token for better security

### "Rejected non-fast-forward updates" Error
If you see this error, it means the remote repository has content that doesn't match your local repository. Try:
```bash
# Pull the remote content first
git pull origin main --allow-unrelated-histories

# Resolve any merge conflicts
# Then push again
git push -u origin main
```

### URL Format Issues
Ensure you're using the correct URL format:
- For HTTPS: `https://github.com/user163264/SPOTVOGEL/lms-system.git`
- For SSH (if set up): `git@github.com:user163264/SPOTVOGEL/lms-system.git`

## Security Note
After successfully setting up the repository, I recommend:
1. Changing your GitHub password
2. Setting up two-factor authentication
3. Using SSH keys or personal access tokens instead of password authentication

Let me know if you encounter any issues during this process, and I'll provide further debugging assistance.
