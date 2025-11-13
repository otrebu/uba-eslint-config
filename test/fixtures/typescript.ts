/* eslint-disable no-console, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

// This file contains intentional TypeScript violations
// If any eslint-disable directive becomes unused, it means a rule was disabled

// Test no-console
console.log("TypeScript file with console");

// Test @typescript-eslint/no-explicit-any
const anyValue: any = "should have a proper type";

// Test @typescript-eslint/no-unused-vars
const unusedVariable = 42;

function testFunction(): void {
  const anotherUnused = "not used";
}
