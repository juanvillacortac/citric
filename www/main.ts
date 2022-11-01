/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$citric/server.ts";
import manifest from "./citric.gen.ts";

import twindPlugin from "$citric/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

import flamethrowerPlugin from "$citric/plugins/flamethrower.ts";

await start(manifest, {
  plugins: [
    twindPlugin(twindConfig),
    flamethrowerPlugin({ prefetch: "hover" }),
  ],
});
