// Jest/Expect augmentations to support objectContaining, any, and toHaveProperty typings
/* eslint-disable @typescript-eslint/no-explicit-any */

// Augment the expect module (Jest v30)
declare module 'expect' {
  interface ExpectStatic {
    any(expected: any): any;
    objectContaining(obj: Record<string, any>): any;
    arrayContaining(arr: any[]): any;
    stringContaining(str: string): any;
    stringMatching(str: string | RegExp): any;
  }
}

// Augment Jest matchers for toHaveProperty
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveProperty(path: string, value?: any): R;
    }
  }

  // Also extend Chai Assertion, since our project mixes Chai/Jest assertions in some contexts
  namespace Chai {
    interface Assertion {
      toHaveProperty(path: string, value?: any): Assertion;
    }
  }
}

/* eslint-enable @typescript-eslint/no-explicit-any */
