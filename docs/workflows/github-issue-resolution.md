# GitHub Issue Resolution Workflow

This document outlines the complete workflow for resolving GitHub issues using MCP tools and AI agentic development practices.

## Prerequisites

Ensure you have access to these MCP servers (configured via VS Code user settings):
- **github**: [Documentation](https://github.com/github/github-mcp-server) - Issue/PR management
- **playwright**: [Documentation](https://github.com/microsoft/playwright-mcp) - Browser automation
- **context7**: [Documentation](https://context7.com) - Library documentation

## Repository Configuration

For all MCP GitHub tool examples in this document:
- **REPO_OWNER**: `ken-guru`
- **REPO_NAME**: `github-copilot-agent-assisted-next-app`

When using this workflow in other repositories, update these values accordingly.

## Workflow Steps

### Step 1: Issue Analysis and Understanding

#### 1.1 Retrieve Issue Details
```bash
# Get comprehensive issue information
mcp_github_issue_read(owner="${REPO_OWNER}", repo="${REPO_NAME}", issue_number=<NUMBER>)
```

#### 1.2 Search Historical Context
```bash
# Search existing memory logs for patterns
# Reference: docs/logged_memories/ for detailed debugging sessions
grep -r "relevant keywords" docs/logged_memories/
```

#### 1.3 Complex Issue Analysis
For complex or unclear issues, delegate to the Researcher subagent for systematic analysis. The Researcher agent can search the codebase, find patterns, and provide a structured summary before implementation.

### Step 2: Issue Verification (If Applicable)

For UI/UX issues, verify the problem using Playwright tools:

#### 2.1 Navigate and Reproduce
```bash
# Navigate to the application
mcp_playwright_browser_navigate(url="http://localhost:3000")

# Take accessibility snapshot for analysis
mcp_playwright_browser_snapshot()

# Test specific user interactions
mcp_playwright_browser_click(element="button description", ref="snapshot_reference")
mcp_playwright_browser_type(element="input field", ref="snapshot_reference", text="test data")

# Document current state
mcp_playwright_browser_take_screenshot(filename="issue-<NUMBER>-current-state.png")
```

### Step 3: Branch Creation and Setup

#### 3.1 Create Feature Branch
```bash
# Create and switch to feature branch
git checkout -b fix-<issue-number>-<brief-description>

# Example: git checkout -b fix-123-button-accessibility-issue
```

**Critical**: Never work directly on main branch - it is protected and requires PR reviews.

### Step 4: Implementation Planning

#### 4.1 Document Implementation Plan
Create entry in `docs/PLANNED_CHANGES.md` using the template:
```bash
# Use the standardized template
# Reference: docs/templates/PLANNED_CHANGES_TEMPLATE.md
```

#### 4.2 Document Implementation Context
Create a memory log entry if the debugging process involves significant investigation:
```bash
# Create memory log in docs/logged_memories/
# Use template: docs/templates/DEBUGGING_SESSION_TEMPLATE.md
```

### Step 5: Implementation and Testing

#### 5.1 Follow Test-Driven Development
```bash
# Write tests first (Jest for component logic)
npm test -- --testPathPatterns="ComponentName"

# Implement solution
# Update tests as needed

# Run full test suite
npm test
```

#### 5.2 Quality Assurance
```bash
# Run all quality checks
npm run lint
npm run type-check
npm run build

# Optional: Run Cypress for workflow testing
npm run cypress:run
```

### Step 6: Commit and Push

#### 6.1 Commit Changes
```bash
git add .
git commit -m "Fix issue #<NUMBER>: <descriptive message>

- Specific change 1
- Specific change 2
- Reference any breaking changes or important notes"

git push origin fix-<issue-number>-<brief-description>
```

### Step 7: Pull Request Creation

#### 7.1 Create PR with MCP Tools
```bash
mcp_github_create_pull_request({
  owner: "ken-guru",
  repo: "github-copilot-agent-assisted-next-app",
  title: "Fix #<NUMBER>: <Clear, descriptive title>",
  head: "fix-<issue-number>-<brief-description>",
  base: "main",
  body: `
## Problem
Brief description of the issue being resolved.

## Solution
Description of the implementation approach.

## Testing
- [ ] Unit tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed
- [ ] No breaking changes

## Related Issues
Fixes #<NUMBER>
`
})
```

### Step 8: Monitoring and Review Response

#### 8.1 Monitor CI/CD Checks
```bash
# Check PR status and CI/CD results
mcp_github_pull_request_read(owner="${REPO_OWNER}", repo="${REPO_NAME}", pullNumber=<PR_NUMBER>)

# Monitor in real-time if needed (fallback to CLI)
gh pr checks <PR_NUMBER> --fail-fast --watch
```

#### 8.2 Handle Code Review Comments
```bash
# Check for review comments
mcp_github_pull_request_read(owner="${REPO_OWNER}", repo="${REPO_NAME}", pullNumber=<PR_NUMBER>)

# Address each comment systematically
# Commit fixes following the same quality process
# Update PR with resolution notes
```

### Step 9: Iterative Resolution

Repeat Steps 5-8 until:
- All CI/CD checks pass
- All code review comments are addressed
- The solution is verified and complete
- PR is approved and ready for merge

### Step 10: Documentation and Memory

#### 10.1 Update Memory Logs
```bash
# Create detailed memory log entry if significant debugging was involved
# Reference: docs/templates/DEBUGGING_SESSION_TEMPLATE.md
# Add entry to docs/MEMORY_LOG.md index
```

#### 10.2 Update Planning Documents
- Move completed change from `docs/PLANNED_CHANGES.md` to `docs/IMPLEMENTED_CHANGES.md`
- Clear planning document for next development cycle

## Tool Usage Patterns

### Issue Analysis
```bash
# GitHub tools for issue understanding
mcp_github_issue_read() → understand requirements and comments
mcp_github_search_issues() → find related issues
```

### Documentation Lookup
```bash
# Tool names vary by MCP client. Use your client's tools panel to find
# the canonical tool names under the `microsoft.docs.mcp` server, then call e.g.:
# <your_microsoft_docs_tool_name>(...) → find relevant documentation

# Context7 for library documentation
# Likewise, discover the tools exposed by the `upstash/context7` server and use e.g.:
# <your_context7_tool_name>(...) → fetch current documentation
```

### UI Verification
```bash
# Playwright for browser automation
mcp_playwright_browser_navigate() → navigate to app
mcp_playwright_browser_snapshot() → capture accessibility tree
mcp_playwright_browser_take_screenshot() → visual documentation
```

### Subagent Delegation
For complex tasks, delegate to specialized agents in `.github/agents/`:
- **Researcher**: Context gathering and code analysis
- **Implementer**: Focused code implementation
- **Reviewer**: Security and quality review

## Quality Gates

Before considering any issue resolved:

1. ✅ **Issue Understanding**: Problem clearly analyzed and verified
2. ✅ **Implementation Complete**: Solution addresses root cause
3. ✅ **Tests Passing**: All quality checks pass locally
4. ✅ **CI/CD Passing**: All automated checks succeed
5. ✅ **Code Review**: All reviewer comments addressed
6. ✅ **Documentation**: Memory logs and planning documents updated
7. ✅ **Verification**: Original issue requirements met

## Troubleshooting

### Common Issues and Solutions

**Branch Protection Errors**:
- Ensure you're working on a feature branch, not main
- Create PR instead of direct push to main

**CI/CD Failures**:
- Run quality checks locally first: `npm test`, `npm run lint`, `npm run type-check`
- Address all errors before pushing

**Code Review Delays**:
- Use `mcp_github_pull_request_read` to check status
- Address comments promptly and comprehensively
- Update PR title/description to reflect current state

**Complex Problem Analysis**:
- Delegate research to Researcher subagent for systematic breakdown
- Search `docs/logged_memories/` for similar historical issues
- Verify problems with Playwright tools before implementing solutions

---

This workflow ensures systematic, high-quality issue resolution while leveraging all available MCP tools for enhanced development efficiency.
