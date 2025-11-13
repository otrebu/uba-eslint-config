/* eslint-disable vitest/expect-expect, no-console */

// This file contains intentional Vitest violations
// If any eslint-disable directive becomes unused, it means a rule was disabled

import { describe, test } from "vitest";

describe("Test suite", () => {
  // Test vitest/expect-expect (no assertions in test)
  test("missing assertion", () => {
    const value = 42;
    console.log(value);
  });
});
