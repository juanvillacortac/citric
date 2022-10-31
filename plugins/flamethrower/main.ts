import flamethrower from "https://esm.sh/v96/flamethrower-router";
import { FlamethrowerOptions } from "https://esm.sh/v96/flamethrower-router@0.0.0-meme.12/dist/interfaces.d.ts";

export function init(config?: FlamethrowerOptions) {
  // @ts-ignore Ignore flamethrower on window
  if (window.flamethrower) return;
  flamethrower(config);
}
