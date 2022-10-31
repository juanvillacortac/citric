import { useState } from "preact/hooks";
import { Button } from "$lib/Button.tsx";

interface CounterProps {
  start: number;
}

export default function Counter(props: CounterProps) {
  const [count, setCount] = useState(props.start)
  return (
    <div class="flex w-full gap-2">
      <p class="font-bold flex-grow-1 text-xl">{count}</p>
      <Button onClick={() => setCount(count - 1)}>-1</Button>
      <Button onClick={() => setCount(count + 1)}>+1</Button>
    </div>
  );
}
