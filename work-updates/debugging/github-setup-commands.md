# GitHub Setup Commands

Here are the exact Git commands to connect our local repository to GitHub:

```bash
# Navigate to our project directory
cd /Users/admin/Documents/lms-system

# Add the GitHub repository as remote
git remote add origin https://github.com/user163264/SPOTVOGEL/lms-system.git

# Add all files to Git tracking
git add .

# Commit changes
git commit -m "Initial commit: Project structure and GitHub configuration"

# Push to GitHub main branch
git push -u origin main

# Create and switch to develop branch
git checkout -b develop

# Push develop branch to GitHub
git push -u origin develop
```

The commands will:
1. Add the GitHub repository as our remote origin
2. Track all files in our local repository
3. Create an initial commit with our project structure
4. Push our main branch to GitHub
5. Create and push a develop branch for our day-to-day work

When running these commands, you'll need to authenticate with GitHub using:
- Username: piet@spotvogel.net
- Password: ._Nutella123

After successful setup, I recommend changing the password for security reasons.
