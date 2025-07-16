# Memory Log Workflow Guide

This guide documents the complete workflow for creating, managing, and accessing debugging knowledge in this project using our hybrid approach with both markdown files and MCP Memory Tool.

## Overview: Hybrid Memory System

We maintain a **dual-system approach** for maximum reliability and accessibility:

- **📝 Markdown Files** (`docs/logged_memories/`): Authoritative source, human-readable, version-controlled
- **🧠 MCP Memory Tool**: AI-accessible knowledge graph with semantic search capabilities

## For Human Developers

### Creating a New Memory Log Entry

1. **Create Markdown File**
   ```bash
   # Use next available ID number
   touch docs/logged_memories/MRTMLY-XXX-descriptive-name.md
   ```

2. **Follow Template Structure**
   ```markdown
   ### Issue: [Problem Description]
   **Date:** YYYY-MM-DD
   **Tags:** #debugging #[area] #[technology]
   **Status:** [In Progress|Resolved|Blocked]

   #### Initial State
   - Description of the failing tests/features
   - Error messages or unexpected behavior
   - Current implementation state

   #### Debug Process
   1. First investigation step
      - What was examined
      - What was found
      - Next steps determined

   2. Solution attempts
      - What was tried
      - Outcome
      - Why it did/didn't work

   #### Resolution (if reached)
   - Final solution implemented
   - Why it worked
   - Tests affected

   #### Lessons Learned
   - Key insights gained
   - Patterns identified
   - Future considerations
   ```

3. **Add Reference to Main Index**
   ```markdown
   # In docs/MEMORY_LOG.md, add:
   - [MRTMLY-XXX: Brief Description](logged_memories/MRTMLY-XXX-descriptive-name.md)
   ```

4. **Migrate to MCP (Optional but Recommended)**
   ```bash
   # Run migration script to sync to MCP Memory Tool
   node scripts/migrate-memory-logs-to-mcp.js
   ```

### Finding Existing Debugging Knowledge

#### Quick Text Search
```bash
# Search all memory logs for keywords
grep -r "service worker" docs/logged_memories/
grep -r "typescript" docs/logged_memories/
```

#### Browse by Category
- Check `docs/MEMORY_LOG.md` for organized list
- Look for common tags: `#debugging`, `#tests`, `#typescript`, `#service-worker`

#### Detailed Reading
- Open specific memory log files for complete debugging process
- Follow referenced files and components
- Check "Lessons Learned" sections for applicable insights

## For AI Agents

### Accessing Historical Debugging Knowledge

#### 1. Semantic Search First
```javascript
// Search for relevant debugging sessions
mcp_memory_search_nodes("component testing typescript errors")
mcp_memory_search_nodes("service worker offline functionality")
mcp_memory_search_nodes("react hooks state management")
```

#### 2. Explore Related Entities
```javascript
// Find related debugging sessions, components, technologies
mcp_memory_open_nodes(["MRTMLY-XXX", "ComponentName", "TechnologyName"])
```

#### 3. Build on Previous Solutions
- Reference similar debugging sessions in current analysis
- Apply learned lessons to new problems
- Connect current issue to established patterns

### Creating New Memory Log Entries

#### 1. Document in Markdown First (Authoritative Source)
```markdown
# Create complete memory log in docs/logged_memories/MRTMLY-XXX-issue-name.md
# Include all debugging steps, attempts, and final resolution
```

#### 2. Migrate to MCP Memory Tool
```javascript
// Create debug session entity
mcp_memory_create_entities([{
  entityType: "debug_session",
  name: "MRTMLY-XXX",
  observations: [
    "Date: YYYY-MM-DD",
    "Problem: [description]",
    "Resolution: [solution]",
    "Lesson: [key insight]"
  ]
}])

// Create related entities (components, technologies, lessons)
mcp_memory_create_entities([...])

// Establish relationships
mcp_memory_create_relations([{
  from: "MRTMLY-XXX",
  relationType: "used_technology",
  to: "TechnologyName"
}])
```

### AI Agent Workflow for Complex Debugging

#### 1. Research Phase
```javascript
// Search for similar issues
mcp_memory_search_nodes("error message keywords")
mcp_memory_search_nodes("component or technology name")
```

#### 2. Analysis Phase
```javascript
// Use sequential thinking for complex problems
mcp_sequential-th_sequentialthinking({
  thought: "Analyzing the issue based on historical patterns...",
  // ... continue systematic analysis
})
```

#### 3. Documentation Phase
```javascript
// Document new findings for future reference
// 1. Create markdown file (authoritative)
// 2. Migrate to MCP (searchable)
// 3. Link to related entities
```

## Migration and Synchronization

### Full Migration Script
```bash
# Migrate all markdown memory logs to MCP
node scripts/migrate-memory-logs-to-mcp.js

# Dry run to preview changes
node scripts/migrate-memory-logs-to-mcp.js --dry-run
```

### Periodic Sync Workflow
1. **New entries created in markdown** (authoritative source)
2. **Run migration script** to sync to MCP
3. **Validate search functionality** with test queries
4. **Commit changes** to version control

## Data Integrity and Backup

### Backup Strategy
- **Primary**: Markdown files in `docs/logged_memories/` (version controlled)
- **Secondary**: MCP Memory Tool (searchable index)
- **Recovery**: Re-run migration script to rebuild MCP from markdown

### Validation Checklist
- [ ] Markdown file follows template structure
- [ ] Entry added to `docs/MEMORY_LOG.md` index
- [ ] MCP entities created successfully
- [ ] Semantic search returns new entry
- [ ] Related entities properly connected
- [ ] Changes committed to version control

## Troubleshooting

### MCP Memory Tool Unavailable
- **Fallback**: Use markdown files directly
- **Search**: Standard text search tools (grep, VS Code search)
- **Recovery**: Re-run migration script when MCP available

### Synchronization Issues
- **Check**: Run migration script in dry-run mode
- **Validate**: Test semantic search with known entries
- **Rebuild**: Delete MCP entities and re-migrate from markdown

### Search Not Finding Expected Results
- **Verify**: Entity names and observations match search terms
- **Check**: Relations between entities are properly established
- **Test**: Use exact entity names from known memory logs

## Best Practices

### For Consistency
- Use sequential MRTMLY-XXX numbering
- Include comprehensive tags in markdown
- Follow template structure exactly
- Document both successful and failed attempts

### For Searchability
- Use descriptive entity names in MCP
- Include relevant technology/component names
- Create meaningful relationships between entities
- Add atomic observations (one fact per observation)

### For Maintenance
- Regular migration script execution
- Periodic validation of search functionality
- Backup verification before major changes
- Documentation updates when workflow changes

## Integration with Development Workflow

### During Debugging Sessions
1. **Research**: Search existing memory logs first
2. **Document**: Record debugging steps in real-time
3. **Share**: Create memory log for team knowledge
4. **Sync**: Migrate to MCP for AI agent access

### During Code Reviews
- Reference relevant memory logs for context
- Check for patterns in debugging history
- Validate solutions against learned lessons
- Update memory logs with new insights

### During Onboarding
- New team members read markdown files for learning
- AI agents use MCP search for quick context
- Both systems provide comprehensive project knowledge
- Hybrid approach ensures accessibility for all participants

---

This workflow ensures robust knowledge management while maximizing accessibility for both human developers and AI agents working on the project.
