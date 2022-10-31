import { JSX } from "preact";
import { IS_BROWSER } from "$lemonade/runtime.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class="border(gray-100 py-1 px-2 2 "
    />
  );
}
