import { join, parse, resolve } from "./src/dev/deps.ts";
import { error } from "./src/dev/error.ts";
import { collect, ensureMinDenoVersion, generate } from "./src/dev/mod.ts";
import { citricImports, twindImports } from "./src/dev/imports.ts";

ensureMinDenoVersion();

const help = `citric-init

Initialize a new Citric project. This will create all the necessary files for a
new project.

To generate a project in the './foobar' subdirectory:
  citric-init ./foobar

To generate a project in the current directory:
  citric-init .

USAGE:
    citric-init <DIRECTORY>

OPTIONS:
    --force   Overwrite existing files
    --twind   Setup project to use 'twind' for styling
    --spa     Setup project to use 'flamethrower' for SPA-like routing
    --vscode  Setup project for VSCode
`;

const CONFIRM_EMPTY_MESSAGE =
  "The target directory is not empty (files could get overwritten). Do you want to continue anyway?";

const USE_TWIND_MESSAGE =
  "Citric has built in support for styling using Tailwind CSS. Do you want to use this?";

const USE_SPA_MESSAGE =
  "Citric has built in support for SPA-like routing using the meme Flamethrower router for static web apps. Do you want to use this?";

const USE_VSCODE_MESSAGE = "Do you use VS Code?";

const flags = parse(Deno.args, {
  boolean: ["force", "twind", "vscode", "spa"],
  default: { force: null, twind: null, vscode: null, spa: null },
});

if (flags._.length !== 1) {
  error(help);
}

console.log(
  `\n%c  🍋 Citric: the next-gen web framework.  %c\n`,
  "background-color: #86efac; color: black; font-weight: bold",
  ""
);

const unresolvedDirectory = Deno.args[0];
const resolvedDirectory = resolve(unresolvedDirectory);

try {
  const dir = [...Deno.readDirSync(resolvedDirectory)];
  const isEmpty =
    dir.length === 0 || (dir.length === 1 && dir[0].name === ".git");
  if (
    !isEmpty &&
    !(flags.force === null ? confirm(CONFIRM_EMPTY_MESSAGE) : flags.force)
  ) {
    error("Directory is not empty.");
  }
} catch (err) {
  if (!(err instanceof Deno.errors.NotFound)) {
    throw err;
  }
}
console.log("%cLet's set up your new Citric project.\n", "font-weight: bold");

const useTwind =
  flags.twind === null ? confirm(USE_TWIND_MESSAGE) : flags.twind;

const useSPA = flags.spa === null ? confirm(USE_SPA_MESSAGE) : flags.spa;

const useVSCode =
  flags.vscode === null ? confirm(USE_VSCODE_MESSAGE) : flags.vscode;

await Deno.mkdir(join(resolvedDirectory, "lib"), {
  recursive: true,
});
await Deno.mkdir(join(resolvedDirectory, "routes", "api", "joke"), {
  recursive: true,
});
await Deno.mkdir(join(resolvedDirectory, "routes", "[name]"), {
  recursive: true,
});
await Deno.mkdir(join(resolvedDirectory, "static"), { recursive: true });
if (useVSCode) {
  await Deno.mkdir(join(resolvedDirectory, ".vscode"), { recursive: true });
}

const importMap = { imports: {} as Record<string, string> };
citricImports(importMap.imports);
if (useTwind) twindImports(importMap.imports);
importMap.imports["$lib/"] = "./lib/";
const IMPORT_MAP_JSON = JSON.stringify(importMap, null, 2) + "\n";
await Deno.writeTextFile(
  join(resolvedDirectory, "import_map.json"),
  IMPORT_MAP_JSON
);

const ROUTES_APP_TSX = `import { LayoutProps } from "$citric/server.ts";
import { Head } from "$citric/runtime.ts";

export default function Layout({ Component }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Citric App</title>
      </Head>
      <div class="flex flex-col">
        <div class="flex bg-green-200 shadow-lg text-sm w-full p-2 justify-between items-center">
          <a href="/" title="Go to home">
            <img
              src="/logo.svg"
              class="h-18 transform w-18 duration-200 hover:scale-110 hover:rotate-12"
              alt="the citric logo: a sliced citric dripping with juice"
            />
          </a>
          <div className="flex space-x-4">
            <a href="/" class="hover:underline">Index</a>
            <a href="/moto" class="hover:underline">
              Another page
            </a>
          </div>
        </div>
        <div class="mx-auto max-w-screen-md p-4">
          <Component />
        </div>
      </div>
    </>
  );
}
`;
await Deno.writeTextFile(
  join(resolvedDirectory, "routes", "+layout.tsx"),
  ROUTES_APP_TSX
);

const ROUTES_INDEX_TSX = `import Counter from "$lib/Counter.island.tsx";

export default function Home() {
  return (
    <>
      <img
        src="/logo.svg"
        ${
          useTwind ? `class="w-32 h-32"` : `width="128"\n          height="128"`
        }
        alt="the citric logo: a sliced citric dripping with juice"
      />
      <p${useTwind ? ` class="my-6"` : ""}>
        Welcome to \`citric\`. Try updating this message in the ./routes/+page.tsx
        file, and refresh.
      </p>
      <Counter start={3} />
    </>
  );
}
`;
await Deno.writeTextFile(
  join(resolvedDirectory, "routes", "+page.tsx"),
  ROUTES_INDEX_TSX
);

const COMPONENTS_BUTTON_TSX = `import { JSX } from "preact";
import { IS_BROWSER } from "$citric/runtime.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
${useTwind ? '      class="border(gray-100 py-1 px-2 2 "\n' : ""}    />
  );
}
`;
await Deno.writeTextFile(
  join(resolvedDirectory, "lib", "Button.tsx"),
  COMPONENTS_BUTTON_TSX
);

const ISLANDS_COUNTER_TSX = `import { useState } from "preact/hooks";
import { Button } from "$lib/Button.tsx";

interface CounterProps {
  start: number;
}

export default function Counter(props: CounterProps) {
  const [count, setCount] = useState(props.start)
  return (
    <div${useTwind ? ' class="flex w-full gap-2"' : ""}>
      <p${useTwind ? ' class="font-bold flex-grow-1 text-xl"' : ""}>{count}</p>
      <Button onClick={() => setCount(count - 1)}>-1</Button>
      <Button onClick={() => setCount(count + 1)}>+1</Button>
    </div>
  );
}
`;
await Deno.writeTextFile(
  join(resolvedDirectory, "lib", "Counter.island.tsx"),
  ISLANDS_COUNTER_TSX
);

const ROUTES_GREET_TSX = `import { PageProps } from "$citric/server.ts";

export default function Greet(props: PageProps) {
  return <div>Hello {props.params.name}</div>;
}
`;
await Deno.writeTextFile(
  join(resolvedDirectory, "routes", "[name]", "+page.tsx"),
  ROUTES_GREET_TSX
);

const ROUTES_API_JOKE_TS = `import { HandlerContext } from "$citric/server.ts";

// Jokes courtesy of https://punsandoneliners.com/randomness/programmer-jokes/
const JOKES = [
  "Why do Java developers often wear glasses? They can't C#.",
  "A SQL query walks into a bar, goes up to two tables and says “can I join you?”",
  "Wasn't hard to crack Forrest Gump's password. 1forrest1.",
  "I love pressing the F5 key. It's refreshing.",
  "Called IT support and a chap from Australia came to fix my network connection.  I asked “Do you come from a LAN down under?”",
  "There are 10 types of people in the world. Those who understand binary and those who don't.",
  "Why are assembly programmers often wet? They work below C level.",
  "My favourite computer based band is the Black IPs.",
  "What programme do you use to predict the music tastes of former US presidential candidates? An Al Gore Rhythm.",
  "An SEO expert walked into a bar, pub, inn, tavern, hostelry, public house.",
];

export const handler = (_req: Request, _ctx: HandlerContext): Response => {
  const randomIndex = Math.floor(Math.random() * JOKES.length);
  const body = JOKES[randomIndex];
  return new Response(body);
};
`;
await Deno.writeTextFile(
  join(resolvedDirectory, "routes", "api", "joke", "+page.ts"),
  ROUTES_API_JOKE_TS
);

const TWIND_CONFIG_TS = `import { Options } from "$citric/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
} as Options;
`;
if (useTwind) {
  await Deno.writeTextFile(
    join(resolvedDirectory, "twind.config.ts"),
    TWIND_CONFIG_TS
  );
}

const STATIC_LOGO = `<svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: invert(1); transform: scale(-1, -1)">
  <path d="M34.092 8.845C38.929 20.652 34.092 27 30 30.5c1 3.5-2.986 4.222-4.5 2.5-4.457 1.537-13.512 1.487-20-5C2 24.5 4.73 16.714 14 11.5c8-4.5 16-7 20.092-2.655Z" fill="#FFDB1E"/>
  <path d="M14 11.5c6.848-4.497 15.025-6.38 18.368-3.47C37.5 12.5 21.5 22.612 15.5 25c-6.5 2.587-3 8.5-6.5 8.5-3 0-2.5-4-5.183-7.75C2.232 23.535 6.16 16.648 14 11.5Z" fill="#fff" stroke="#FFDB1E"/>
  <path d="M28.535 8.772c4.645 1.25-.365 5.695-4.303 8.536-3.732 2.692-6.606 4.21-7.923 4.83-.366.173-1.617-2.252-1.617-1 0 .417-.7 2.238-.934 2.326-1.365.512-4.223 1.29-5.835 1.29-3.491 0-1.923-4.754 3.014-9.122.892-.789 1.478-.645 2.283-.645-.537-.773-.534-.917.403-1.546C17.79 10.64 23 8.77 25.212 8.42c.366.014.82.35.82.629.41-.14 2.095-.388 2.503-.278Z" fill="#FFE600"/>
  <path d="M14.297 16.49c.985-.747 1.644-1.01 2.099-2.526.566.121.841-.08 1.29-.701.324.466 1.657.608 2.453.701-.715.451-1.057.852-1.452 2.106-1.464-.611-3.167-.302-4.39.42Z" fill="#fff"/>
</svg>`;

await Deno.writeTextFile(
  join(resolvedDirectory, "static", "logo.svg"),
  STATIC_LOGO
);

try {
  const faviconArrayBuffer = await fetch(
    "https://citric.deno.dev/favicon.ico"
  ).then((d) => d.arrayBuffer());
  await Deno.writeFile(
    join(resolvedDirectory, "static", "favicon.ico"),
    new Uint8Array(faviconArrayBuffer)
  );
} catch {
  // Skip this and be silent if there is a nework issue.
}

let MAIN_TS = `/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$citric/server.ts";
import manifest from "./citric.gen.ts";
`;

if (useTwind) {
  MAIN_TS += `
import twindPlugin from "$citric/plugins/twind.ts";
import twindConfig from "./twind.config.ts";
`;
}

if (useSPA) {
  MAIN_TS += `
import flamethrowerPlugin from "$citric/plugins/flamethrower.ts";
`;
}

MAIN_TS += `
await start(manifest, {
  plugins: [${useTwind ? "\n    twindPlugin(twindConfig)," : ""}${
  useSPA ? '\n    flamethrowerPlugin({ prefetch: "hover" }),' : ""
}
  ]
});\n`;
const MAIN_TS_PATH = join(resolvedDirectory, "main.ts");
await Deno.writeTextFile(MAIN_TS_PATH, MAIN_TS);

const DEV_TS = `#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$citric/dev.ts";

await dev(import.meta.url, "./main.ts");
`;
const DEV_TS_PATH = join(resolvedDirectory, "dev.ts");
await Deno.writeTextFile(DEV_TS_PATH, DEV_TS);
try {
  await Deno.chmod(DEV_TS_PATH, 0o777);
} catch {
  // this throws on windows
}

const config = {
  tasks: {
    start: "deno run -A --watch=static/,routes/ dev.ts",
  },
  importMap: "./import_map.json",
  compilerOptions: {
    jsx: "react-jsx",
    jsxImportSource: "preact",
  },
};
const DENO_CONFIG = JSON.stringify(config, null, 2) + "\n";

await Deno.writeTextFile(join(resolvedDirectory, "deno.json"), DENO_CONFIG);

const README_MD = `# citric project

### Usage

Start the project:

\`\`\`
deno task start
\`\`\`

This will watch the project directory and restart as necessary.
`;
await Deno.writeTextFile(join(resolvedDirectory, "README.md"), README_MD);

const vscodeSettings = {
  "deno.enable": true,
  "deno.lint": true,
  "editor.defaultFormatter": "denoland.vscode-deno",
};

const VSCODE_SETTINGS = JSON.stringify(vscodeSettings, null, 2) + "\n";

if (useVSCode) {
  await Deno.writeTextFile(
    join(resolvedDirectory, ".vscode", "settings.json"),
    VSCODE_SETTINGS
  );
}

const vscodeExtensions = {
  recommendations: ["denoland.vscode-deno"],
};

if (useTwind) {
  vscodeExtensions.recommendations.push("sastan.twind-intellisense");
}

const VSCODE_EXTENSIONS = JSON.stringify(vscodeExtensions, null, 2) + "\n";

if (useVSCode) {
  await Deno.writeTextFile(
    join(resolvedDirectory, ".vscode", "extensions.json"),
    VSCODE_EXTENSIONS
  );
}

const manifest = await collect(resolvedDirectory);
await generate(resolvedDirectory, manifest);

// Specifically print unresolvedDirectory, rather than resolvedDirectory in order to
// not leak personal info (e.g. `/Users/MyName`)
console.log("\n%cProject initialized!\n", "color: green; font-weight: bold");

console.log(
  `Enter your project directory using %ccd ${unresolvedDirectory}%c.`,
  "color: cyan",
  ""
);
console.log(
  "Run %cdeno task start%c to start the project. %cCTRL-C%c to stop.",
  "color: cyan",
  "",
  "color: cyan",
  ""
);
console.log();
console.log(
  "Stuck? Join our Discord %chttps://discord.gg/deno",
  "color: cyan",
  ""
);
console.log();
console.log("%cHappy hacking! 🦕", "color: gray");
