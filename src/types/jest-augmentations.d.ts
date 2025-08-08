// Jest/Expect augmentations to support objectContaining, any, and toHaveProperty typings
/* eslint-disable @typescript-eslint/no-explicit-any */

// Map global expect to Jest's expect type to avoid Chai Assertion bleed-through
type JestExpectType = typeof import('@jest/globals')['expect'];
declare global {
  const expect: JestExpectType;
}

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
}

/* eslint-enable @typescript-eslint/no-explicit-any */
