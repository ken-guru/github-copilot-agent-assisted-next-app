# CodeQL Setup and Usage Guide

## Overview

This document outlines how CodeQL is set up for our Next.js project to detect security vulnerabilities and code quality issues automatically.

## What is CodeQL?

CodeQL is a semantic code analysis engine that treats code as data, allowing you to query for patterns that could indicate security vulnerabilities or quality issues.

## How It's Set Up

### Configuration Files

- **CodeQL Config**: `.github/codeql/codeql-config.yml` defines which queries to run and which files to analyze.
- **GitHub Workflow**: `.github/workflows/codeql-analysis.yml` sets up automated analysis on push, pull requests, and a weekly schedule.

### Custom Queries

We've implemented custom queries located in `.github/codeql/custom-queries/`:

1. **UnvalidatedDynamicContent.ql**: Detects potential XSS vulnerabilities from unvalidated user input used in dynamic content.
2. **HardcodedSecrets.ql**: Finds potentially hardcoded credentials in the source code.
3. **NoSSRFunctionComponentCheck.ql**: Warns about components using browser-specific APIs without SSR environment checks.
4. **UnnecessaryDependencies.ql**: Identifies hook dependencies that are listed but not actually used in the hook callback.

## Running Locally (Optional)

If you want to run CodeQL locally during development:

1. Install the CodeQL CLI: https://github.com/github/codeql-cli-binaries
2. Create a database:
   ```bash
   codeql database create codeql-db --language=javascript,typescript --source-root .
   ```
3. Run analysis:
   ```bash
   codeql database analyze codeql-db .github/codeql/custom-queries --format=sarif-latest --output=results.sarif
   ```
4. Review the results in the SARIF file.

## Common Issues and Solutions

- **False Positives**: If you encounter false positives, add comments to explain why the pattern is safe or modify the query for greater precision.
- **New Query Ideas**: If you identify a recurring issue that could be detected automatically, consider creating a new custom query.

## Maintenance

- Review and update queries as new security patterns emerge.
- Add new queries for any recurring code quality issues identified during code reviews.
- Keep the list of ignored paths up to date.
