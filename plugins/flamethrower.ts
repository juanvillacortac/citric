import { Plugin } from "$citric/server.ts";
import { FlamethrowerOptions } from "https://esm.sh/v96/flamethrower-router@0.0.0-meme.12/dist/interfaces.d.ts";

export default function flamethrower(options?: FlamethrowerOptions): Plugin {
  const main = `data:application/javascript,import { init } from "${
    new URL("./flamethrower/main.ts", import.meta.url).href
  }";
export default function(state) { init(state); }`;

  return {
    name: "flamethrower",
    entrypoints: { main },
    render({ render }) {
      render();
      return {
        scripts: [{ entrypoint: "main", state: options }],
      };
    },
  };
}
