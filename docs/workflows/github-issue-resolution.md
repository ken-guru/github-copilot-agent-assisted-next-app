# GitHub Issue Resolution Workflow

This document outlines the complete workflow for resolving GitHub issues using MCP tools and AI agentic development practices.

## Prerequisites

Ensure you have access to these MCP tools:
- **GitHub MCP Server**: [Documentation](https://github.com/github/github-mcp-server)
- **Time Tools**: [Documentation](https://github.com/modelcontextprotocol/servers/tree/main/src/time)
- **Sequential Thinking**: [Documentation](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking)
- **Memory Tools**: [Documentation](https://github.com/modelcontextprotocol/servers/tree/main/src/memory)
- **Playwright Automation**: [Documentation](https://github.com/executeautomation/mcp-playwright)

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
mcp_github_get_issue(owner="${REPO_OWNER}", repo="${REPO_NAME}", issue_number=<NUMBER>)

# Get issue comments for additional context
mcp_github_get_issue_comments(owner="${REPO_OWNER}", repo="${REPO_NAME}", issue_number=<NUMBER>)
```

#### 1.2 Search Historical Context
```bash
# Search memory for similar issues
mcp_memory_search_nodes(query="issue type keywords debugging solution")

# Search existing memory logs for patterns
# Reference: docs/logged_memories/ for detailed debugging sessions
```

#### 1.3 Complex Issue Analysis
For complex or unclear issues, use sequential thinking:
```bash
mcp_sequential-th_sequentialthinking({
  thought: "Breaking down this issue: What are the core problems? What components are affected? What are the user impacts?",
  nextThoughtNeeded: true,
  thoughtNumber: 1,
  totalThoughts: 5
})
```

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

#### 4.2 Store Implementation Context
```bash
# Create memory entities for tracking
mcp_memory_create_entities([{
  name: "Issue-<NUMBER>-Resolution",
  entityType: "debugging_session",
  observations: ["Initial analysis", "Implementation approach", "Test strategy"]
}])
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
mcp_github_get_pull_request_status(owner="${REPO_OWNER}", repo="${REPO_NAME}", pullNumber=<PR_NUMBER>)

# Monitor in real-time if needed (fallback to CLI)
gh pr checks <PR_NUMBER> --fail-fast --watch
```

#### 8.2 Handle Code Review Comments
```bash
# Check for review comments
mcp_github_get_pull_request_reviews(owner="${REPO_OWNER}", repo="${REPO_NAME}", pullNumber=<PR_NUMBER>)

mcp_github_get_pull_request_comments(owner="${REPO_OWNER}", repo="${REPO_NAME}", pullNumber=<PR_NUMBER>)

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
# Create detailed memory log entry
# Reference: docs/templates/DEBUGGING_SESSION_TEMPLATE.md

# Update MCP memory with resolution
mcp_memory_add_observations([{
  entityName: "Issue-<NUMBER>-Resolution",
  contents: ["Final solution implemented", "Tests added", "Issue resolved"]
}])

# Create relationships for future reference
mcp_memory_create_relations([{
  from: "Issue-<NUMBER>-Resolution",
  to: "ComponentName",
  relationType: "resolved_issue_in"
}])
```

#### 10.2 Update Planning Documents
- Move completed change from `docs/PLANNED_CHANGES.md` to `docs/IMPLEMENTED_CHANGES.md`
- Clear planning document for next development cycle

## Tool Combination Strategies

### Complex Problem Analysis
```bash
# Use Sequential Thinking + Memory together
mcp_sequential-th_sequentialthinking() → analyze problem systematically
mcp_memory_search_nodes() → find relevant historical context
mcp_memory_create_entities() → document analysis outcomes
```

### Issue Verification and Testing
```bash
# Use Playwright + GitHub tools
mcp_playwright_browser_* → verify issue and test solution
mcp_github_get_issue() → understand requirements
mcp_github_create_pull_request() → document verification results
```

### Time Management and Coordination
```bash
# Use Time tools for documentation
mcp_time_get_current_time("UTC") → timestamp memory logs
mcp_time_convert_time() → coordinate across timezones
```

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
- Use `mcp_github_get_pull_request_reviews` to check status
- Address comments promptly and comprehensively
- Update PR title/description to reflect current state

**Complex Problem Analysis**:
- Use `mcp_sequential-th_sequentialthinking` for systematic breakdown
- Reference memory logs for similar historical issues
- Verify problems with Playwright tools before implementing solutions

---

This workflow ensures systematic, high-quality issue resolution while leveraging all available MCP tools for enhanced development efficiency.
