// This file enhances Jest's TypeScript definitions

import '@testing-library/jest-dom';

// Fix for Jest assertion methods in TypeScript
// Override the global Chai.Assertion interface to add Jest methods
declare global {
  export namespace Chai {
    interface Assertion {
      // Core Jest matchers
      toBe(expected: any): Assertion;
      toEqual(expected: any): Assertion;
      toBeDefined(): Assertion;
      toBeUndefined(): Assertion;
      toBeNull(): Assertion;
      toBeNaN(): Assertion;
      toBeTruthy(): Assertion;
      toBeFalsy(): Assertion;
      toBeGreaterThan(num: number): Assertion;
      toBeGreaterThanOrEqual(num: number): Assertion;
      toBeLessThan(num: number): Assertion;
      toBeLessThanOrEqual(num: number): Assertion;
      toBeCloseTo(num: number, numDigits?: number): Assertion;
      toContain(item: any): Assertion;
      toHaveLength(length: number): Assertion;
      toBeInstanceOf(cls: any): Assertion;
      
      // Mock/spy matchers
      toHaveBeenCalled(): Assertion;
      toHaveBeenCalledTimes(num: number): Assertion;
      toHaveBeenCalledWith(...args: any[]): Assertion;
      toHaveBeenLastCalledWith(...args: any[]): Assertion;
      toHaveBeenNthCalledWith(nth: number, ...args: any[]): Assertion;
      toHaveReturned(): Assertion;
      toHaveReturnedTimes(num: number): Assertion;
      toHaveReturnedWith(value: any): Assertion;
      toHaveLastReturnedWith(value: any): Assertion;
      toHaveNthReturnedWith(nth: number, value: any): Assertion;
      
      // DOM matchers
      toBeDisabled(): Assertion;
      toBeEnabled(): Assertion;
      toBeEmpty(): Assertion;
      toBeInTheDocument(): Assertion;
      toBeInvalid(): Assertion;
      toBeRequired(): Assertion;
      toBeValid(): Assertion;
      toBeVisible(): Assertion;
      toContainElement(element: HTMLElement | null): Assertion;
      toContainHTML(html: string): Assertion;
      toHaveAttribute(attr: string, value?: any): Assertion;
      toHaveClass(...classNames: string[]): Assertion;
      toHaveFocus(): Assertion;
      toHaveFormValues(expectedValues: Record<string, any>): Assertion;
      toHaveStyle(css: string | Record<string, any>): Assertion;
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): Assertion;
      toHaveValue(value: any): Assertion;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): Assertion;
      
      // Async matchers
      resolves: Assertion;
      rejects: Assertion;
    }
  }
  
  // Add Jest's expect function to global
  function expect(actual: any): Chai.Assertion;
  namespace expect {
    function extend(matchers: Record<string, any>): void;
    function assertions(num: number): void;
    function anything(): any;
    function any(constructor: any): any;
    function arrayContaining(arr: Array<any>): any;
    function objectContaining(obj: Record<string, any>): any;
    function stringContaining(str: string): any;
    function stringMatching(str: string | RegExp): any;
  }
}

// No export needed as this is a global declaration file
