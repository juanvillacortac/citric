/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$lemonade/server.ts";
import manifest from "./lemonade.gen.ts";

import twindPlugin from "$lemonade/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

import flamethrowerPlugin from "$lemonade/plugins/flamethrower.ts";

await start(manifest, {
  plugins: [
    twindPlugin(twindConfig),
    flamethrowerPlugin({ prefetch: "hover" }),
  ],
});
