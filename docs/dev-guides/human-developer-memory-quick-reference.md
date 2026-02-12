# Human Developer Quick Reference: Memory Log System

## 🔍 FINDING DEBUGGING SOLUTIONS

### Quick Text Search
```bash
# Search all memory logs for keywords
grep -r "service worker" docs/logged_memories/
grep -r "typescript error" docs/logged_memories/
grep -r "component testing" docs/logged_memories/
```

### Browse by Index
```bash
# View organized list of all debugging sessions
cat docs/MEMORY_LOG.md
# Or open in your editor for clickable links
code docs/MEMORY_LOG.md
```

### Search by Tags
```bash
# Find entries with specific tags
grep -r "#service-worker" docs/logged_memories/
grep -r "#typescript" docs/logged_memories/
grep -r "#tests" docs/logged_memories/
```

## 📝 CREATING NEW MEMORY LOG

### Step 1: Create File
```bash
# Use next available number (check docs/MEMORY_LOG.md for latest)
touch docs/logged_memories/MRTMLY-XXX-brief-description.md
```

### Step 2: Use Template
```markdown
### Issue: [Clear Description of Problem]
**Date:** YYYY-MM-DD  
**Tags:** #debugging #[component] #[technology]
**Status:** [In Progress|Resolved|Blocked]

#### Initial State
- What was failing/broken
- Error messages received
- Current system state

#### Debug Process
1. First investigation step
   - What you checked
   - What you found
   - Next steps taken

2. Solution attempts
   - What you tried
   - Results/outcome
   - Why it worked or didn't work

#### Resolution (when reached)
- Final working solution
- Why this approach succeeded
- Tests that needed updating

#### Lessons Learned
- Key insights for future debugging
- Patterns identified
- Best practices discovered
```

### Step 3: Add to Index
```markdown
# Add to docs/MEMORY_LOG.md at the end:
- [MRTMLY-XXX: Brief Description](#placeholder-link)
```

## 🎯 COMMON DEBUGGING SCENARIOS

| When You're Stuck | What to Search | Where to Look |
|-------------------|----------------|---------------|
| Build failures | `"build error"` `"deployment"` | CI/CD related logs |
| Test failures | `"jest"` `"cypress"` `"testing"` | Test-specific debugging |
| Component issues | Component name + `"error"` | Component-related logs |
| TypeScript errors | `"typescript"` `"type error"` | Type system debugging |
| Service Worker issues | `"service worker"` `"offline"` | PWA related logs |

## 🔧 MAINTENANCE TASKS

### Weekly
- [ ] Check for missing entries in MEMORY_LOG.md index
- [ ] Validate that recent debugging sessions are documented

### Monthly  
- [ ] Review and update memory log tags for consistency
- [ ] Clean up any duplicate or outdated entries
- [ ] Ensure all resolved issues have complete documentation

## 📋 QUALITY CHECKLIST

Before closing a debugging session:
- [ ] Memory log created with complete debugging process
- [ ] All attempted solutions documented (even failed ones)
- [ ] Root cause clearly identified and explained
- [ ] Final solution documented with reasoning
- [ ] Lessons learned section completed
- [ ] Entry added to MEMORY_LOG.md index
- [ ] Appropriate tags added for future searchability

## 💡 PRO TIPS

**Document Failed Attempts**: Often as valuable as successful solutions
**Use Descriptive Filenames**: Make it easy to find entries later
**Include Error Messages**: Exact text helps with searching
**Link Related Issues**: Reference other memory logs when relevant
**Update When Revisited**: Add new insights to existing entries

---
**Full Documentation**: `docs/dev-guides/memory-log-workflow.md`
