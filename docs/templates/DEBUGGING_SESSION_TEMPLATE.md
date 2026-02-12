# Debugging Session Template

Use this template when documenting debugging sessions in the Memory Log system.

## Basic Template Structure

```markdown
### Issue: [Test/Feature Name] Debugging Session
**Date:** YYYY-MM-DD
**Tags:** #debugging #tests #[relevant-area]
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

3. Additional investigations
   - Continue numbering steps
   - Include both successful and failed attempts
   - Document reasoning for each approach

#### Resolution (if reached)
- Final solution implemented
- Why it worked
- Tests affected
- Any remaining considerations

#### Lessons Learned
- Key insights gained
- Patterns identified
- Future considerations
- Applicable to similar issues

#### MCP Tool Usage (when available)
- **GitHub Tools**: Document PR/issue analysis steps
- **Playwright Tools**: Record UI verification and testing steps
- **Context7**: Fetch up-to-date library documentation and code examples
- **Microsoft Docs**: Reference official documentation
```

## Extended Template for Complex Issues

For complex debugging sessions involving multiple components or systems:

```markdown
### Issue: [Complex Issue Name] - Multi-Component Debugging Session
**Date:** YYYY-MM-DD
**Tags:** #debugging #complex #[area1] #[area2] #[area3]
**Status:** [In Progress|Resolved|Blocked]

#### Issue Context
- **Affected Components**: List all components involved
- **User Impact**: Description of user-facing problems
- **Technical Scope**: Systems/areas affected
- **Initial Hypothesis**: Starting theory about root cause

#### Investigation Timeline
##### Phase 1: Initial Analysis
- **Approach**: How you started investigating
- **Findings**: What was discovered
- **Tools Used**: MCP tools, debugging techniques employed
- **Outcome**: Results of this phase

##### Phase 2: Deep Dive
- **Approach**: Next investigation steps
- **Findings**: Additional discoveries
- **Tools Used**: Additional MCP tools or techniques
- **Outcome**: Results and next steps identified

##### Phase 3: Solution Implementation
- **Approach**: Implementation strategy
- **Changes Made**: Specific code/config changes
- **Testing Strategy**: How solution was validated
- **Outcome**: Final results

#### Root Cause Analysis
- **Primary Cause**: Main issue identified
- **Contributing Factors**: Secondary issues that exacerbated the problem
- **Why It Happened**: Analysis of how the issue developed
- **Prevention Strategy**: How to avoid similar issues

#### Solution Architecture
- **Implementation Details**: Technical approach taken
- **Alternative Solutions Considered**: Other approaches evaluated
- **Trade-offs Made**: Decisions and compromises
- **Future Improvements**: Potential enhancements

#### Testing and Validation
- **Test Strategy**: How the solution was verified
- **Edge Cases Covered**: Boundary conditions tested
- **Regression Testing**: Ensuring no new issues introduced
- **Performance Impact**: Any performance considerations

#### Documentation and Knowledge Transfer
- **Documentation Updated**: Files modified or created
- **Memory Log Entries**: Related debugging sessions
- **Team Communication**: How findings were shared
- **Process Improvements**: Changes to debugging procedures

#### MCP Tool Integration
- **GitHub Tool Usage**: PR/issue management steps
- **Playwright Verification**: UI testing and validation
- **Context7**: Library documentation and code examples integration
- **Microsoft Docs**: Reference official documentation

#### Future Considerations
- **Monitoring**: What to watch for ongoing
- **Related Issues**: Potential similar problems
- **Architecture Improvements**: System-level enhancements
- **Process Learnings**: Debugging methodology improvements
```

## Template Usage Guidelines

### When to Use Basic Template
- Single component issues
- Straightforward debugging sessions
- Clear problem scope
- Relatively quick resolution

### When to Use Extended Template
- Multi-component issues
- Complex system interactions
- Architecture-level problems
- Issues requiring significant analysis
- Problems with wide user impact
- Solutions requiring extensive testing

### Template Customization
Feel free to modify sections based on:
- Issue complexity
- Team requirements
- Project-specific needs
- Tool availability

### Integration with Memory Log System

When creating memory log entries, add them to the index:

```bash
# Add entry to docs/MEMORY_LOG.md index
# Follow the template structure above
# Include relevant tags for searchability
```

This enables future searching and knowledge building across debugging sessions.
