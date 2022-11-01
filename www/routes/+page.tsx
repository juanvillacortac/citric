import Counter from "$lib/Counter.island.tsx";
import { Handlers } from "$citric/server.ts";
import VERSIONS from "../../versions.json" assert { type: "json" };

export const handler: Handlers = {
  GET(req, ctx) {
    const agent = req.headers.get("user-agent");
    if (agent && agent.includes("Deno")) {
      const path = `https://deno.land/x/citric@${VERSIONS[0]}/init.ts`;
      return new Response(`Redirecting to ${path}`, {
        headers: { "Location": path },
        status: 307,
      });
    }
    return ctx.render();
  },
};

export default function Home() {
  return (
    <>
      <img
        src="/logo.svg"
        class="h-32 w-32"
        alt="the citric logo: a sliced citric dripping with juice"
      />
      <p class="my-6">
        Welcome to `citric`. Try updating this message in the ./routes/+page.tsx
        file, and refresh.
      </p>
      <Counter start={3} />
    </>
  );
}
