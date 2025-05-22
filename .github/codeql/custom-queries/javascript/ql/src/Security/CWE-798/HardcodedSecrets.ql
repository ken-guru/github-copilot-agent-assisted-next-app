/**
 * @name Hard-coded secrets
 * @description Hard-coding credentials in source code may expose them to attackers.
 * @kind problem
 * @problem.severity error
 * @security-severity 9.8
 * @precision high
 * @id js/hardcoded-secrets
 * @tags security
 *       external/cwe/cwe-798
 */

import javascript

/**
 * Holds if `name` is a name commonly associated with secrets or credentials.
 */
predicate isSensitiveName(string name) {
  name.toLowerCase().matches([
    "%password%", "%passwd%", "%pwd%", "%secret%", "%token%", "%api%key%",
    "%auth%", "%credential%", "%apikey%", "%accesskey%", "%access%token%"
  ])
}

from Variable v, string nameStr
where
  v.isDefinition() and
  v.getName() = nameStr and
  isSensitiveName(nameStr) and
  exists(StringLiteral str |
    str.getEnclosingStmt() = v.getDefinition().getEnclosingStmt() and
    str.getStringValue().length() > 8
  )
select v, "Possible hardcoded credential in variable '" + nameStr + "'"
