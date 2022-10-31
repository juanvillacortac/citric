import { LayoutProps } from "$lemonade/server.ts";
import { Head } from "$lemonade/runtime.ts";

export default function Layout({ Component }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Lemonade App</title>
      </Head>
      <div class="flex flex-col">
        <div class="flex bg-green-200 shadow-lg text-sm w-full p-2 justify-between items-center">
          <a href="/" title="Go to home">
            <img
              src="/logo.svg"
              class="h-18 transform w-18 duration-200 hover:scale-110 hover:rotate-12"
              alt="the lemonade logo: a sliced lemon dripping with juice"
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
