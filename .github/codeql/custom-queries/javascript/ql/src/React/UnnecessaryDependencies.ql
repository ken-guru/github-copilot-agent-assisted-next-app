/**
 * @name Unnecessary dependencies in useEffect/useCallback
 * @description Identifies dependencies listed in hooks that aren't used in the callback body.
 * @kind problem
 * @problem.severity warning
 * @precision medium
 * @id js/react/unnecessary-dependencies
 * @tags correctness
 *       maintainability
 */

import javascript

/**
 * Represents a React hook call like useEffect, useCallback, useMemo.
 */
class ReactHookCall extends CallExpr {
  ReactHookCall() {
    this.getCalleeName() in ["useEffect", "useCallback", "useMemo"]
  }
  
  /**
   * Gets the callback function passed to the hook.
   */
  Function getCallback() {
    result = this.getArgument(0).getAChildExpr().(Function)
  }
  
  /**
   * Gets the dependency array argument.
   */
  ArrayExpr getDependencyArray() {
    result = this.getArgument(1)
  }
}

from ReactHookCall hookCall, ArrayExpr depArray, Expr dependency, string depName
where
  depArray = hookCall.getDependencyArray() and
  dependency = depArray.getAnElement() and
  // Get the name of the dependency
  (
    dependency instanceof Identifier and
    depName = dependency.(Identifier).getName()
    or
    dependency instanceof PropAccess and
    depName = dependency.(PropAccess).getPropertyName()
  ) and
  // Check if the dependency is not used in the callback
  not exists(Identifier used |
    used.getContainer() = hookCall.getCallback() and
    used.getName() = depName and
    // Ignore parameters and local variables
    not used.getVariable().getDeclaredScope() = hookCall.getCallback()
  )
select dependency, "Dependency '" + depName + "' is listed but not used in the hook's callback"
