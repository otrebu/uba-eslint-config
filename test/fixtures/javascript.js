/* eslint-disable no-console, no-var, max-params */

// This file contains intentional violations to test that rules are enabled
// If any eslint-disable directive becomes unused, it means a rule was disabled

// Test no-console
console.log("This should trigger no-console");

// Test no-var
var testVariable = "should use const/let";

export { testVariable };

// Test max-params (limit is 3)
export function performAction(a, b, c, d) {
  return a + b + c + d;
}
