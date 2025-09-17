# Archived GitHub Workflows

This directory contains archived GitHub Actions workflows that are no longer active.

## Archived Files

### nuxthub-archived-2025-01-16.yml
- **Original Name**: nuxthub.yml
- **Archived Date**: January 16, 2025
- **Status**: Successfully tested and verified before archiving
- **Test Results**: ✅ All pipeline steps passed (linting, type checking, build)
- **Reason for Archiving**: CI/CD workflow archived as requested

## Workflow Details

The archived CI/CD pipeline included:
- **Triggers**: Push to main/develop branches, PRs to main
- **Test Job**: Linting, type checking, and build verification
- **Deploy Job**: Configured for production deployment (manual setup required)
- **Node.js Version**: 24
- **Package Manager**: pnpm v10

## Re-enabling Workflows

To re-enable an archived workflow:
1. Copy the archived file back to the parent workflows directory
2. Remove the "ARCHIVED" suffix from the name
3. Uncomment the trigger events (push/pull_request)
4. Update the workflow name to remove "(ARCHIVED)"

## Notes

All archived workflows were fully functional at the time of archiving.