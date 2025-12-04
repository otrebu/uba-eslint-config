/* eslint-disable perfectionist/sort-imports, unicorn/prefer-export-from */

// This file contains intentional import violations
// If any eslint-disable directive becomes unused, it means a rule was disabled

// Test perfectionist/sort-imports (should be sorted: fs before path)
import path from "node:path";
import fs from "node:fs";

export { fs, path };
