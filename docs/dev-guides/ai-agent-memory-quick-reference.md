# AI Agent Quick Reference: Memory Log System

## 🔍 FINDING DEBUGGING KNOWLEDGE (Start Here)

### Step 1: Search MCP Memory Tool
```javascript
// Search for your problem keywords
mcp_memory_search_nodes("error message or component name")
mcp_memory_search_nodes("technology typescript react")
mcp_memory_search_nodes("service worker testing")
```

### Step 2: Get Related Context
```javascript
// Open specific debugging sessions
mcp_memory_open_nodes(["MRTMLY-XXX", "ComponentName"])
// Explore the complete knowledge graph
mcp_memory_read_graph()
```

## 📝 CREATING NEW MEMORY LOGS

### Step 1: Create Markdown File (REQUIRED)
```markdown
# File: docs/logged_memories/MRTMLY-XXX-issue-description.md
### Issue: [Problem Description]
**Date:** 2025-07-16
**Tags:** #debugging #[area] #[technology]
**Status:** Resolved

#### Initial State
[What was broken/failing]

#### Debug Process
[Step-by-step investigation and attempts]

#### Resolution
[Final working solution]

#### Lessons Learned
[Key insights for future reference]
```

### Step 2: Sync to MCP (RECOMMENDED)
```javascript
// Create debug session entity
mcp_memory_create_entities([{
  entityType: "debug_session", 
  name: "MRTMLY-XXX",
  observations: [
    "Date: 2025-07-16",
    "Problem: [brief description]",
    "Resolution: [solution summary]",
    "Lesson: [key insight]"
  ]
}])

// Create related entities and relations
mcp_memory_create_entities([...]) // components, technologies, lessons
mcp_memory_create_relations([...]) // connections between entities
```

## 🎯 COMMON SEARCH PATTERNS

| Problem Type | Search Query | Expected Results |
|--------------|--------------|------------------|
| Component errors | `"ComponentName testing errors"` | Related debugging sessions |
| Technology issues | `"typescript service worker"` | Technology-specific solutions |
| Build/Deploy | `"build errors deployment"` | CI/CD debugging sessions |
| Test failures | `"jest testing cypress"` | Test-related debugging |

## 🔧 EMERGENCY FALLBACK

If MCP Memory Tool unavailable:
```bash
# Use standard text search on markdown files
grep -r "search terms" docs/logged_memories/
# Browse organized index
cat docs/MEMORY_LOG.md
```

## ⚡ WORKFLOW PRIORITY

1. **Search existing knowledge first** (MCP + markdown)
2. **Build on previous solutions** rather than starting from scratch
3. **Document new findings** for future AI agents
4. **Create knowledge connections** between related issues

## 📋 QUICK VALIDATION

- [ ] Searched MCP memory before starting new investigation
- [ ] Created markdown file for new debugging session
- [ ] Synced findings to MCP memory tool
- [ ] Added relevant tags and relationships
- [ ] Verified search returns new entry

---
**Full Documentation**: `docs/dev-guides/memory-log-workflow.md`
