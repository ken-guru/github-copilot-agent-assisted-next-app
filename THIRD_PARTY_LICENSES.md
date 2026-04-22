# Third-Party Licenses

This document lists all third-party software packages used by this project, along with their respective licenses, versions, and source repositories. All packages have been reviewed for license compatibility.

## License Compliance Summary

All dependencies in this project use **permissive open-source licenses**. No copyleft licenses (GPL, LGPL, AGPL, etc.) are present. The licenses in use are:

| License | Type | Distribution Requirements |
|---------|------|--------------------------|
| MIT | Permissive | Include copyright notice and license text when redistributing |
| Apache-2.0 | Permissive | Include copyright notice, license text, and NOTICE file (if any) when redistributing |
| BSD-3-Clause | Permissive | Include copyright notice and license text; do not use contributor names for endorsement |
| ISC | Permissive | Include copyright notice and license text when redistributing |
| BlueOak-1.0.0 | Permissive | Include copyright notice and license text when redistributing |

No license violations were found. All dependencies are compatible with one another and with private/commercial use.

---

## Runtime Dependencies

These packages are included in the production build and are shipped to end users.

| Package | Version | License | Repository |
|---------|---------|---------|------------|
| `@vercel/analytics` | 2.0.1 | MIT | https://github.com/vercel/analytics |
| `@vercel/blob` | 2.3.3 | Apache-2.0 | https://github.com/vercel/storage |
| `@vercel/speed-insights` | 2.0.0 | Apache-2.0 | https://github.com/vercel/speed-insights |
| `bootstrap` | 5.3.8 | MIT | https://github.com/twbs/bootstrap |
| `bootstrap-icons` | 1.13.1 | MIT | https://github.com/twbs/icons |
| `next` | 16.2.4 | MIT | https://github.com/vercel/next.js |
| `react` | 19.2.5 | MIT | https://github.com/facebook/react |
| `react-bootstrap` | 2.10.10 | MIT | https://github.com/react-bootstrap/react-bootstrap |
| `react-dom` | 19.2.5 | MIT | https://github.com/facebook/react |
| `react-swipeable` | 7.0.2 | MIT | https://github.com/FormidableLabs/react-swipeable |
| `zod` | 4.3.6 | MIT | https://github.com/colinhacks/zod |

---

## Development Dependencies

These packages are used only during development and testing and are **not** included in the production build shipped to end users.

| Package | Version | License | Repository |
|---------|---------|---------|------------|
| `@testing-library/dom` | 10.4.1 | MIT | https://github.com/testing-library/dom-testing-library |
| `@testing-library/jest-dom` | 6.9.1 | MIT | https://github.com/testing-library/jest-dom |
| `@testing-library/react` | 16.3.2 | MIT | https://github.com/testing-library/react-testing-library |
| `@types/jest` | 30.0.0 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| `@types/jest-axe` | 3.5.9 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| `@types/node` | 25.6.0 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| `@types/react` | 19.2.14 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| `@types/react-dom` | 19.2.3 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| `cypress` | 15.14.1 | MIT | https://github.com/cypress-io/cypress |
| `eslint` | 10.2.1 | MIT | https://github.com/eslint/eslint |
| `eslint-config-next` | 16.2.4 | MIT | https://github.com/vercel/next.js |
| `fast-check` | 4.7.0 | MIT | https://github.com/dubzzz/fast-check |
| `jest` | 30.3.0 | MIT | https://github.com/jestjs/jest |
| `jest-axe` | 10.0.0 | MIT | https://github.com/nickcolley/jest-axe |
| `jest-environment-jsdom` | 30.3.0 | MIT | https://github.com/jestjs/jest |
| `typescript` | 6.0.3 | Apache-2.0 | https://github.com/microsoft/TypeScript |

---

## Dependency Overrides

The following packages are pinned via the `overrides` field in `package.json` to resolve security advisories or version conflicts in the transitive dependency tree.

| Package | Version | License | Repository |
|---------|---------|---------|------------|
| `glob` | 13.0.6 | BlueOak-1.0.0 | https://github.com/isaacs/node-glob |
| `qs` | 6.15.1 | BSD-3-Clause | https://github.com/ljharb/qs |
| `test-exclude` | 8.0.0 | ISC | https://github.com/istanbuljs/test-exclude |
| `inflight` | 0.0.0 (stubbed) | N/A | Replaced with `@empty-package/no-inflight` to suppress deprecated dependency |

---

## License Texts

### MIT License

The MIT License applies to the following packages:
`@vercel/analytics`, `bootstrap`, `bootstrap-icons`, `next`, `react`, `react-bootstrap`, `react-dom`, `react-swipeable`, `zod`, `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/react`, `@types/jest`, `@types/jest-axe`, `@types/node`, `@types/react`, `@types/react-dom`, `cypress`, `eslint`, `eslint-config-next`, `fast-check`, `jest`, `jest-axe`, `jest-environment-jsdom`

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Full license text for each package is available at the repository URLs listed above.

### Apache License 2.0

The Apache License 2.0 applies to: `@vercel/blob`, `@vercel/speed-insights`, `typescript`

Key requirements:
- Reproduce copyright notices in distributions
- Include a copy of the Apache License 2.0
- State any significant changes made to the original files
- If the package includes a NOTICE file, include it in distributions

Full license text: https://www.apache.org/licenses/LICENSE-2.0

### BSD 3-Clause License

The BSD 3-Clause License applies to: `qs`

Key requirements:
- Retain the copyright notice, list of conditions, and disclaimer in source and binary distributions
- Do not use the names of contributors to endorse or promote derived products without prior written permission

Full license text for `qs`: https://github.com/ljharb/qs/blob/main/LICENSE.md

### ISC License

The ISC License applies to: `test-exclude`

The ISC License is functionally equivalent to the simplified BSD 2-Clause License. It requires inclusion of the copyright notice and license text in redistributions.

Full license text for `test-exclude`: https://github.com/istanbuljs/test-exclude/blob/main/LICENSE

### Blue Oak Model License 1.0.0

The Blue Oak Model License applies to: `glob`

This is a permissive license similar to MIT, requiring attribution. It is [approved by the Open Source Initiative](https://blueoakcouncil.org/license/1.0.0).

Full license text for `glob`: https://github.com/isaacs/node-glob/blob/main/LICENSE

---

## Notes

- This project is marked `"private": true` in `package.json` and is not published to npm. Distribution requirements for licenses above are primarily relevant if the compiled application is redistributed.
- The `apps/mobile/node_modules` directory in the repository appears to be a leftover artifact from a mobile sub-project that has since been removed (no `package.json` is present for it). It is not part of the active build and should be removed or added to `.gitignore`.
- Vercel SVG assets (`public/vercel.svg`, `public/next.svg`) are provided by Vercel as part of the Next.js starter template and are used here for branding/attribution purposes only.
- This document should be updated whenever dependencies are added, removed, or upgraded.
