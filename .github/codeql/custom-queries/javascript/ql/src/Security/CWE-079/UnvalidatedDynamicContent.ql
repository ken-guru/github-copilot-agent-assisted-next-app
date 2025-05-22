/**
 * @name Unvalidated dynamic content in Next.js components
 * @description Using unvalidated user input in dynamic content can lead to XSS vulnerabilities.
 * @kind path-problem
 * @problem.severity error
 * @security-severity 7.5
 * @precision high
 * @id js/nextjs/unvalidated-dynamic-content
 * @tags security
 *       external/cwe/cwe-079
 */

import javascript
import DataFlow::PathGraph

class DangerousSink extends DataFlow::Node {
  DangerousSink() {
    exists(DataFlow::Node prop |
      // Check for dangerouslySetInnerHTML in JSX
      prop.asExpr().(PropWrite).getPropertyName() = "dangerouslySetInnerHTML" and
      this = prop
    )
    or
    exists(CallExpr eval |
      // Check for eval calls
      eval.getCalleeName() = "eval" and
      this.asExpr() = eval.getArgument(0)
    )
  }
}

class UserInputSource extends DataFlow::Node {
  UserInputSource() {
    // URLs, form inputs, etc.
    exists(CallExpr call |
      call.getCalleeName() = "useRouter" and
      this.asExpr().getParentExpr*() = call
    )
    or
    exists(DataFlow::PropRead read |
      read.getPropertyName() = "query" and
      this = read
    )
    or
    exists(DataFlow::PropRead read |
      read.getPropertyName() = "body" and
      this = read
    )
  }
}

class Config extends DataFlow::Configuration {
  Config() { this = "UnvalidatedDynamicContentConfig" }

  override predicate isSource(DataFlow::Node source) {
    source instanceof UserInputSource
  }

  override predicate isSink(DataFlow::Node sink) {
    sink instanceof DangerousSink
  }
}

from Config config, DataFlow::PathNode source, DataFlow::PathNode sink
where config.hasFlowPath(source, sink)
select sink, source, sink, "Potentially unsafe use of user input in dynamic content"
