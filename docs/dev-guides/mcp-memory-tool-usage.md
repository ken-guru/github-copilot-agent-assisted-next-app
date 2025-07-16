# MCP Memory Tool Usage Guide

This guide documents how to use the MCP (Model Context Protocol) Memory Tool for enhanced AI-assisted development in this project.

## Overview

The MCP Memory Tool provides a knowledge graph storage system that allows AI agents to store, search, and retrieve project-specific knowledge more effectively than traditional file-based approaches.

## Key Capabilities

### 1. Entity Management
- **Create entities** with types (debug_session, component, technology, lesson, pattern, etc.)
- **Add observations** to existing entities to build knowledge over time
- **Search entities** using semantic queries for relevant information

### 2. Relationship Mapping
- **Create relations** between entities to build connected knowledge
- **Track dependencies** between components, debugging sessions, and solutions
- **Map patterns** across different parts of the system

### 3. Semantic Search
- **Natural language queries** to find relevant debugging information
- **Cross-reference** related entities automatically
- **Discover patterns** in historical debugging sessions

## Entity Types Used in This Project

### debug_session
Represents individual debugging sessions from memory logs
- **Observations**: Date, status, initial state, problems, resolutions, lessons learned
- **Relations**: involved_component, used_technology, learned_lesson, implemented_pattern

### component
Application components involved in debugging sessions
- **Observations**: Component purpose, integration details, testing approaches
- **Relations**: enables, tested_with, depends_on

### technology
Technologies, frameworks, or tools used in the project
- **Observations**: Usage patterns, configuration requirements, best practices
- **Relations**: implements, supports, requires

### lesson
Key insights learned from debugging sessions
- **Observations**: Best practices, anti-patterns, guidelines
- **Relations**: validates, contradicts, builds_on

### pattern
Reusable patterns or approaches discovered
- **Observations**: Implementation details, use cases, benefits
- **Relations**: implements, exemplifies, supersedes

## Example Usage

### Creating a Debug Session Entity
```javascript
// AI agent creates entity for a debugging session
mcp_memory_create_entities([{
  entityType: "debug_session",
  name: "ISSUE-123",
  observations: [
    "Date: 2024-01-15",
    "Problem: Component not rendering correctly",
    "Root Cause: Missing prop validation",
    "Resolution: Added PropTypes and default props",
    "Lesson: Always validate component props"
  ]
}])
```

### Finding Relevant Information
```javascript
// AI agent searches for related debugging sessions
mcp_memory_search_nodes("component rendering prop validation")
// Returns entities related to component rendering issues
```

### Building Knowledge Connections
```javascript
// AI agent creates relationships between entities
mcp_memory_create_relations([{
  from: "ISSUE-123",
  relationType: "learned_lesson", 
  to: "Prop Validation Best Practices"
}])
```

## Migration from Memory Logs

### Current State
- **Source**: 219 markdown files in `docs/logged_memories/`
- **Format**: Structured debugging sessions with date, tags, status, process, resolution
- **Limitations**: Requires manual browsing, no semantic search, limited AI agent access

### Migration Benefits
- **AI Accessibility**: Programmatic access for AI agents to historical debugging knowledge
- **Semantic Search**: Natural language queries to find relevant debugging sessions
- **Knowledge Building**: Connected insights across different debugging sessions
- **Pattern Recognition**: Automatic discovery of recurring issues and solutions

### Migration Script
The project includes `scripts/migrate-memory-logs-to-mcp.js` for automated migration:
- **Parsing**: Extracts structured data from markdown memory logs
- **Entity Creation**: Creates debug_session, component, technology, and lesson entities
- **Relation Mapping**: Establishes connections between debugging sessions and related concepts
- **Batch Processing**: Handles large volumes of data in manageable chunks

## Proof of Concept Results

### Successfully Migrated
- **MRTMLY-001**: Activity Type Integration and Color Handling Refactor
- **MRTMLY-002**: Service Worker 404 Error Debugging Session

### Validation Results
- ✅ **Entity Creation**: Debug sessions, components, technologies, lessons successfully created
- ✅ **Relationship Mapping**: Connections between entities properly established
- ✅ **Semantic Search**: Queries return relevant debugging information
- ✅ **Knowledge Graph**: Related entities discoverable through search

### Search Examples
```javascript
// Find service worker related issues
mcp_memory_search_nodes("Service Worker")
// Returns: MRTMLY-002, Service Worker entity, SPA Routing pattern, etc.

// Find specific debugging session
mcp_memory_search_nodes("MRTMLY-001") 
// Returns: Activity Type Refactor details and related entities
```

## Best Practices for AI Agents

### 1. Creating Entities
- Use consistent entity types (debug_session, component, technology, lesson, pattern)
- Include comprehensive observations with key details
- Reference original issue IDs or memory log entries

### 2. Building Relations
- Connect debugging sessions to involved components and technologies
- Link resolutions to learned lessons and discovered patterns
- Use descriptive relation types (involved_component, learned_lesson, implements)

### 3. Searching Effectively  
- Use specific keywords from the domain (component names, technology names)
- Include context in search queries (e.g., "service worker routing 404")
- Combine multiple search terms for more targeted results

### 4. Maintaining Knowledge
- Add observations to existing entities rather than duplicating
- Update relation mappings as new patterns emerge
- Cross-reference related debugging sessions

## Integration with Existing Workflow

### Hybrid Approach
- **MCP Memory Tool**: For AI agent queries and knowledge discovery
- **Markdown Files**: For detailed human reference and version control
- **Both Systems**: Maintained in parallel for comprehensive coverage

### When to Use MCP Memory Tool
- AI agents seeking debugging guidance
- Finding patterns across multiple debugging sessions
- Discovering related components or technologies
- Building on previous solutions

### When to Use Markdown Files
- Detailed human review of debugging processes
- Creating new memory log entries (then migrate to MCP)
- Backup and version control of debugging history
- Sharing debugging knowledge with team members

## Future Enhancements

### Planned Improvements
- **Full Migration**: Migrate all 219 memory log entries to MCP
- **Export Mechanism**: Create backup system for MCP data
- **Template Updates**: Update debugging templates to include MCP operations
- **Workflow Integration**: Seamless integration between markdown and MCP systems

### Monitoring and Validation
- Regular validation of MCP data integrity
- Performance monitoring for search operations
- Feedback collection on AI agent effectiveness
- Continuous improvement of entity structures and relations

## Conclusion

The MCP Memory Tool significantly enhances AI-assisted development by making project knowledge more accessible and queryable. The successful proof of concept demonstrates its effectiveness for debugging assistance and knowledge building.

For implementation questions or issues, refer to the migration script and POC examples in this repository.
