import subprocess
import os

def run_command(command):
    """Run a shell command and print output."""
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    print(f"STDOUT: {result.stdout}")
    if result.stderr:
        print(f"STDERR: {result.stderr}")
    return result

def main():
    """Push repository to GitHub."""
    # Change to project directory
    os.chdir('/Users/admin/Documents/lms-system')
    print(f"Current directory: {os.getcwd()}")
    
    # Add GitHub as remote origin
    run_command('git remote add origin https://github.com/user163264/SPOTVOGEL/lms-system.git')
    
    # Stage all files
    run_command('git add .')
    
    # Commit changes
    run_command('git commit -m "Initial commit: Project structure and GitHub configuration"')
    
    # Push to main branch
    run_command('git push -u origin main')
    
    # Create and switch to develop branch
    run_command('git checkout -b develop')
    
    # Push develop branch
    run_command('git push -u origin develop')
    
    print("Repository successfully pushed to GitHub!")

if __name__ == "__main__":
    main()
