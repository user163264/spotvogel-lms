# API Security Checklist

## Pre-Commit Checks

Before committing code, ensure the following:

- [ ] No API keys, tokens, or credentials are hardcoded in the source code
- [ ] No environment files (`.env`) containing real credentials are included in the commit
- [ ] Test files don't contain actual API keys or sensitive credentials
- [ ] Debugging comments with API keys or tokens have been removed
- [ ] HTML files don't contain API keys as attributes or JavaScript variables
- [ ] Frontend code uses environment variables injected at build time, not hardcoded values

## Environment Setup

- [ ] All sensitive values are stored in `.env` files that are in `.gitignore`
- [ ] `.env.example` file is maintained with placeholder values for required variables
- [ ] Server-side validation is implemented for API keys before making external requests
- [ ] Development environment uses separate API keys from production

## API Key Management

- [ ] Each developer has their own API key for development
- [ ] API keys have the minimum necessary permissions
- [ ] API keys have usage limits set where possible
- [ ] Rate limiting is implemented to prevent abuse
- [ ] Production API keys are stored in a secrets management system

## Frontend Security

- [ ] API calls are proxied through a backend to avoid exposing keys in frontend code
- [ ] No sensitive parameters are included in URLs or client-side code
- [ ] User permissions are checked on the server side, not only in the UI

## Documentation

- [ ] Security documentation explains how to correctly use API keys
- [ ] New team members are onboarded with API security best practices
- [ ] API usage is monitored for unusual patterns or excessive use

## GitHub Configuration

- [ ] GitHub push protection is enabled
- [ ] Secret scanning is configured
- [ ] Branch protection rules require code reviews before merging

## Usage Instructions

1. Copy this checklist to your PR description or use it in your code review process
2. Mark each item as completed or explain why it's not applicable
3. For any failed checks, address the issues before proceeding

---

Created by: Frank De Poorter  
Date: March 29, 2025  
Updated: [Update date here when modified]
