# 🔒 Security Guidelines

## Protected Files

The following files contain sensitive information and are **NEVER** committed to the repository:

### OAuth Credentials
- `credentials.json` - Google OAuth client credentials
- `token.json` - Google OAuth access tokens

### Service Account Keys
- `src/services/pdfviewer-472517-d1d6e1e42371.json` - Google Service Account key

### Environment Variables
- `*.env` - Environment configuration files
- `.env.local` - Local environment variables
- `.env.production` - Production environment variables

### Other Sensitive Files
- `*.key` - Private keys
- `*.pem` - Certificate files
- `*.secret` - Secret configuration files

## Git Hooks Protection

This repository includes Git hooks that automatically prevent sensitive files from being committed or pushed:

### Pre-commit Hook
- Scans staged files before each commit
- Blocks commits containing protected files
- Provides clear error messages and instructions

### Pre-push Hook
- Scans files before pushing to remote repository
- Prevents accidental exposure of sensitive data
- Suggests remediation steps

## Setup Instructions

### 1. Create OAuth Credentials
```bash
# Download OAuth credentials from Google Cloud Console
# Save as credentials.json in project root
```

### 2. Generate OAuth Token
```bash
# Run OAuth authentication
node getToken.js
# This creates token.json automatically
```

### 3. Verify Protection
```bash
# Test that sensitive files are blocked
git add credentials.json
git commit -m "test"  # This should fail
```

## Security Best Practices

1. **Never commit credentials** - Always use environment variables or secure vaults
2. **Use .gitignore** - Keep sensitive files out of version control
3. **Rotate credentials regularly** - Update OAuth tokens and API keys periodically
4. **Use different credentials** - Separate development, staging, and production credentials
5. **Monitor access logs** - Keep track of who accesses sensitive data

## Emergency Response

If sensitive data is accidentally committed:

1. **Immediately revoke credentials** in Google Cloud Console
2. **Remove from Git history** using `git filter-branch` or BFG Repo-Cleaner
3. **Force push** to update remote repository
4. **Generate new credentials** and update all environments
5. **Notify team members** to update their local copies

## Contact

For security concerns, contact the development team immediately.
