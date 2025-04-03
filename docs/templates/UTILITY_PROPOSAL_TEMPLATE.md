# Utility Function Proposal Template

## Utility Name: [Name of the proposed utility function]

### Overview
[Brief description of what the utility does and why it's needed]

### Proposed Implementation

```typescript
/**
 * [JSDoc comment describing the function]
 *
 * @param param1 - [Description of param1]
 * @param param2 - [Description of param2]
 * @returns [Description of return value]
 *
 * @example
 * // Example usage
 * const result = utilityName(arg1, arg2);
 */
function utilityName(param1: Type1, param2: Type2): ReturnType {
  // Implementation
}
```

### Usage Examples

```typescript
// Example 1: Basic usage
utilityName(value1, value2);

// Example 2: Edge case handling
utilityName(edgeValue, normalValue);

// Example 3: Integration with components
function MyComponent() {
  const result = utilityName(prop1, prop2);
  return <div>{result}</div>;
}
```

### Edge Cases and Handling

| Input Scenario | Expected Behavior | Rationale |
|----------------|-------------------|-----------|
| Negative values | [Behavior] | [Explanation] |
| Zero values | [Behavior] | [Explanation] |
| Large values | [Behavior] | [Explanation] |
| Invalid inputs | [Behavior] | [Explanation] |

### Alternative Approaches Considered

[Describe any alternative implementations that were considered and why they were rejected]

### Impact Assessment

**Files affected:**
- [List of files that will need to be modified]

**Breaking changes:**
- [Any breaking changes to existing functionality]

**Performance implications:**
- [Any significant performance considerations]

### Testing Strategy

[Describe how this utility will be tested, including test cases for normal operation and edge cases]

## Review Checklist

- [ ] Documentation is clear and complete
- [ ] Edge cases are properly handled
- [ ] Implementation follows project coding standards
- [ ] Tests cover core functionality and edge cases
- [ ] No duplicate functionality with existing utilities
- [ ] Performance considerations addressed

## Reviewer Notes

[This section to be filled by reviewer(s)]
