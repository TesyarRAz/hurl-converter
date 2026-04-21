# Plan: Fix GitHub Actions Auto-Publish Pipeline

## TL;DR
> Fix GitHub Actions workflow to properly auto-publish VS Code extension to Marketplace with version bumping.

---

## Context

**Issue**: User wants auto-publish on push to main OR via tag. Current workflow needs fixing:
- Version bumping is Manual input but should be automatic
- Need to handle `package.json` version update automatically
- Need proper version tag creation

---

## TODOs

- [x] 1. Update workflow with automatic version bumping

  **What to do**: Update `.github/workflows/publish.yml` to:
  - Add npm version bumping on push to main (patch by default)
  - Support manual version bump via workflow_dispatch
  - Create git tag after publish
  - Add proper version handling

  **QA Scenarios**:
  ```
  Scenario: Push to main triggers build + version bump
    Expected: npm version patch runs, package.json version updated

  Scenario: workflow_dispatch with version input
    Expected: Version bumped according to input (patch|minor|major)

  Scenario: Tag created after publish
    Expected: git tag v{version} created
  ```

- [x] 2. Test workflow syntax

  **What to do**: Verify YAML is valid with actions/checkout, actions/setup-node, actions/upload-artifact, actions/download-artifact

---

## Success Criteria

- [x] Workflow builds on push to main
- [x] Version bumped automatically  
- [x] Can publish manually via workflow_dispatch
- [x] Git tag created after successful publish