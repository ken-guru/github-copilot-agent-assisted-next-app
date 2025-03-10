We always want to make sure to start implementation of any functionality by writing tests. Ask any relevant questions to clarify the expected behavior before writing these tests.

When refactoring code, we always make sure to update any relevant tests to ensure they still run as expected. If changes to the test include changes to expected behavior, ask clarifying questions to ensure we avoid changing behavior of the application due to outdated tests, or due to unintended changes in refactored code.

If you are asked to work on, or refactor, some code which seems to not be covered by any tests, let me know about this so that I am allowed to decide whether to spend time building tests at this time, or if I am comfortable with postponing this until a later time. If I decide to postpone this, do not ask about this again in the current session, but if I indicate I've completed the planned tasks for this session, remind me of this decision to allow me to revisit the missing tests before finishing the session.

When you work on a single code file that exceeds 200 lines of code, feel free to suggest changes such as refactoring by splitting it up in a logical way or creating new components to contain functionality that could be extracted this way.

After making any changes, summarize these to me to allow me the chance to ask any follow-up questions. This could be both to clarify or explain the reasoning behind the way something was changed, or to let me direct you to revisit something to approach the solution in a different way.

If any of the changes made significantly changes the behavior or functionality described in README.md, let me know and suggest how README.md could be updated to better reflect the current state of the application.