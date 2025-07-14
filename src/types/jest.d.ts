/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

// Explicit Jest global declarations to ensure they override any other conflicting types
declare global {
  namespace jest {
    interface Expect {
      <T = unknown>(actual: T): JestMatchers<T>;
    }

    interface Matchers<R, T = object> {
      toBe(expected: T): R;
      toEqual(expected: T): R;
      toBeTruthy(): R;
      toBeFalsy(): R;
      toBeNull(): R;
      toBeUndefined(): R;
      toBeDefined(): R;
      toBeInstanceOf(expected: new (...args: unknown[]) => unknown): R;
      toBeGreaterThan(expected: number | bigint): R;
      toBeGreaterThanOrEqual(expected: number | bigint): R;
      toBeLessThan(expected: number | bigint): R;
      toBeLessThanOrEqual(expected: number | bigint): R;
      toBeCloseTo(expected: number, precision?: number): R;
      toContain(expected: unknown): R;
      toContainEqual(expected: unknown): R;
      toHaveLength(expected: number): R;
      toHaveProperty(keyPath: string, value?: unknown): R;
      toMatch(expected: string | RegExp): R;
      toMatchObject(expected: object): R;
      toThrow(error?: string | Error | RegExp | ((error: Error) => boolean)): R;
      toThrowError(error?: string | Error | RegExp | ((error: Error) => boolean)): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledTimes(expected: number): R;
      toHaveBeenCalledWith(...params: unknown[]): R;
      toHaveBeenLastCalledWith(...params: unknown[]): R;
      toHaveBeenNthCalledWith(nthCall: number, ...params: unknown[]): R;
      toHaveReturned(): R;
      toHaveReturnedTimes(expected: number): R;
      toHaveReturnedWith(expected: unknown): R;
      toHaveLastReturnedWith(expected: unknown): R;
      toHaveNthReturnedWith(nthCall: number, expected: unknown): R;
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveStyle(css: string | object): R;
      toHaveAttribute(attribute: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      toContainElement(element: HTMLElement | null): R;
    }
    
    interface JestMatchers<T> extends Matchers<void, T> {
      not: Matchers<void, T>;
    }
  }

  const expect: jest.Expect;
}

export {};
