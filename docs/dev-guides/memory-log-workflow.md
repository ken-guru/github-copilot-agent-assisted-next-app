# Memory Log Workflow Guide

This guide documents the workflow for creating and managing debugging knowledge in this project using markdown-based memory logs.

## Overview

We maintain debugging knowledge in markdown files stored in `docs/logged_memories/`. These files are:

- **Human-readable**: Clear documentation of debugging sessions
- **Version-controlled**: Full history in Git
- **Searchable**: Standard text search tools work well
- **AI-accessible**: Agents can read these files directly

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

#### 1. Search Memory Logs
```bash
# Use grep to search memory logs by keywords
grep -r "component testing" docs/logged_memories/
grep -r "state management" docs/logged_memories/
```

You can also use VS Code's search functionality to browse memory logs interactively.

#### 2. Read Relevant Files
- Open specific memory log files for detailed context
- Reference similar debugging sessions in current analysis
- Apply learned lessons to new problems

#### 3. Delegate Research
For complex issues, use the Researcher subagent to:
- Search the codebase for patterns
- Find related memory logs
- Provide a structured summary before implementation

### Creating New Memory Log Entries

#### 1. Document in Markdown
```markdown
# Create complete memory log in docs/logged_memories/MRTMLY-XXX-issue-name.md
# Include all debugging steps, attempts, and final resolution
```

#### 2. Update Index
```markdown
# Add entry to docs/MEMORY_LOG.md for discoverability
```

### AI Agent Workflow for Complex Debugging

#### 1. Research Phase
- Search existing memory logs for similar issues
- Use Researcher subagent for codebase analysis
- Check `docs/logged_memories/` directory

#### 2. Analysis Phase
- Review findings from research
- Identify patterns from historical debugging sessions
- Plan implementation approach

#### 3. Documentation Phase
- Create memory log file (if significant debugging involved)
- Document findings for future reference
- Update index for discoverability

## Data Integrity and Backup

### Backup Strategy
- **Primary**: Markdown files in `docs/logged_memories/` (version controlled)
- **Recovery**: Standard Git history provides full backup

### Validation Checklist
- [ ] Markdown file follows template structure
- [ ] Entry added to `docs/MEMORY_LOG.md` index
- [ ] Related files and components referenced
- [ ] Changes committed to version control

## Best Practices

### For Consistency
- Use sequential MRTMLY-XXX numbering
- Include comprehensive tags in markdown
- Follow template structure exactly
- Document both successful and failed attempts

### For Searchability
- Use descriptive file names
- Include relevant technology/component names in tags
- Write clear "Lessons Learned" sections
- Reference related debugging sessions

### For Maintenance
- Regular review of memory log index
- Periodic cleanup of resolved entries
- Documentation updates when patterns change

## Integration with Development Workflow

### During Debugging Sessions
1. **Research**: Search existing memory logs first
2. **Document**: Record debugging steps in real-time
3. **Share**: Create memory log for team knowledge

### During Code Reviews
- Reference relevant memory logs for context
- Check for patterns in debugging history
- Validate solutions against learned lessons
- Update memory logs with new insights

### During Onboarding
- New team members read markdown files for learning
- Memory logs provide comprehensive project knowledge
- Historical debugging sessions teach common patterns

---

This workflow ensures knowledge is captured and accessible for both human developers and AI agents working on the project.
