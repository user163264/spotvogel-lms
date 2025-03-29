# Creating Our Feature Branch

I've created two script options for creating our feature branch:

## Option 1: Use the wrapper script (recommended)
I've created a new wrapper script that will:
1. Make the original script executable 
2. Run it automatically

Just run:
```bash
sh /Users/admin/Documents/lms-system/work-updates/exercise-generation/create_branch.sh
```

## Option 2: Manual approach
If you prefer to do it manually:

```bash
# First make the script executable
chmod +x /Users/admin/Documents/lms-system/work-updates/exercise-generation/branch_creation.sh

# Then run it
/Users/admin/Documents/lms-system/work-updates/exercise-generation/branch_creation.sh
```

## Option 3: Direct execution without making executable
You can also directly execute without changing permissions:

```bash
bash /Users/admin/Documents/lms-system/work-updates/exercise-generation/branch_creation.sh
```

## Verification
After running any of these options, verify you're on the new branch with:
```bash
git branch
```

You should see `feature/matching-words-exercise` with an asterisk indicating it's the current branch.

Document created by: Alex Ex  
Date: March 28, 2025
