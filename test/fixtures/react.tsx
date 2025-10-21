/* eslint-disable react/button-has-type, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, no-console, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-confusing-void-expression, import/no-unresolved, import/prefer-default-export */

// This file contains intentional React violations
// If any eslint-disable directive becomes unused, it means a rule was disabled

import { useEffect, useState } from "react";

export function TestComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);
  }, [count]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Click me</button>

      <div onClick={() => console.log("clicked")}>Clickable div</div>
    </div>
  );
}
