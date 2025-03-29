# Contributing to the Teacher-Focused LMS

Thank you for your interest in contributing to our Teacher-Focused Learning Management System! This document provides guidelines and workflows for contributing to the project.

## Team Workflow

Our team follows a structured workflow with clearly defined roles:

- **Finny Frontend** - Handles UI/UX implementation and frontend code
- **Sarah Server** - Manages backend systems, APIs, and database integration
- **Alex Ex** - Develops AI exercise generation features
- **Frank De Poorter** - Oversees the project and handles debugging

## Git Workflow

### Branching Strategy

We follow a modified Git Flow branching strategy:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Individual feature branches (e.g., `feature/login-page`)
- `bugfix/*` - Bug fix branches (e.g., `bugfix/auth-token-issue`)
- `hotfix/*` - Urgent production fixes (e.g., `hotfix/critical-security-issue`)

### Branch Naming Convention

- Feature branches: `feature/short-description`
- Bug fix branches: `bugfix/issue-short-description`
- Hotfix branches: `hotfix/issue-short-description`

### Pull Request Process

1. Create a new branch from `develop` (for features/bugfixes) or `main` (for hotfixes)
2. Develop and test your changes locally
3. Push your branch to GitHub
4. Create a Pull Request to merge back into the appropriate branch
5. Request a code review from at least one team member
6. Address any feedback or issues
7. Once approved, the PR can be merged

## Commit Message Guidelines

We follow the Conventional Commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(auth): implement JWT authentication

Added JWT token generation and validation middleware.
Includes user login and token refresh endpoints.

Closes #45
```

## Code Style and Standards

### JavaScript/TypeScript
- Follow ESLint configuration
- Use meaningful variable and function names
- Write JSDoc comments for functions and complex code blocks

### React
- Use functional components with hooks
- Follow component folder structure
- Use proper prop validation

### Backend
- Follow RESTful API design principles
- Implement proper error handling
- Write unit tests for critical functionality

## Work Updates

Each team member should document their work in the appropriate folder under `work-updates/`:

- Frontend updates go in `work-updates/frontend/`
- Backend updates go in `work-updates/backend/`
- Exercise generation updates go in `work-updates/exercise-generation/`
- Debugging information goes in `work-updates/debugging/`

## Pull Request Template

When creating a Pull Request, please use the following template:

```markdown
## Description
[Describe the changes made and why they were made]

## Type of change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
[Describe the tests that you ran to verify your changes]

## Checklist:
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## Questions?

If you have any questions about the contribution process, please reach out to Frank De Poorter, our project overseer.
