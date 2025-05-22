/**
 * @name Missing SSR checks in Next.js components
 * @description Components that interact with browser-specific APIs should check for SSR environment.
 * @kind problem
 * @problem.severity warning
 * @precision medium
 * @id js/nextjs/missing-ssr-check
 * @tags maintainability
 *       correctness
 */

import javascript

/**
 * Holds if the function might be a React component.
 */
predicate isReactComponent(Function f) {
  // Function named with PascalCase
  f.getName().regexpMatch("^[A-Z][a-zA-Z0-9]*$")
  or
  // Function returns JSX
  exists(ReturnStmt ret | 
    ret.getContainer() = f and
    ret.getExpr().getStringValue().regexpMatch(".*<.*>.*")
  )
}

/**
 * Identifies browser-only APIs that could cause SSR issues.
 */
predicate isBrowserAPI(Expr expr) {
  exists(PropAccess pa |
    pa = expr and
    (
      pa.getPropertyName() = "window" or
      pa.getPropertyName() = "document" or
      pa.getPropertyName() = "localStorage" or
      pa.getPropertyName() = "sessionStorage" or
      pa.getPropertyName() = "navigator"
    )
  )
}

/**
 * Holds if the function contains a check for the SSR environment.
 */
predicate hasSSRCheck(Function f) {
  exists(IfStmt ifStmt |
    ifStmt.getContainer() = f and
    ifStmt.getCondition().toString().regexpMatch(".*(typeof window|window === undefined|typeof document).*")
  )
  or
  exists(LogicalExpr logExpr |
    logExpr.getContainer() = f and
    logExpr.toString().regexpMatch(".*(typeof window|window === undefined|typeof document).*")
  )
}

from Function f, Expr browserAPI
where
  isReactComponent(f) and
  isBrowserAPI(browserAPI) and
  browserAPI.getContainer() = f and
  not hasSSRCheck(f)
select f, "Component uses browser API '" + browserAPI + "' without checking for SSR environment"
