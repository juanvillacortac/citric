# Citric

<img align="right" src="./www/static/logo.svg" height="150px" alt="the fresh logo: a sliced citric dripping with juice">

**Citric™**, the "blazing fast" 🐌 and "bleeding edge" 🤡 Fresh fork that you
don't need, unless you want:

- Islands on any directory, only suffix the component with
  `.island.{tsx|ts|jsx|js}`.
- File-system routing à la ~~Next.js~~ SvelteKit, including nested layouts
  (WIP).
- More premade plugins, like SPA client navigation.
- And more unnecesary and forced stuff on this refreshing frankenstein.

## ❓ Why?

The real question is: _why not?_

## 📖 Documentation

The [documentation](https://fresh.deno.dev/docs/) is the same as Fresh docs, but
with some differences:

- Routes now are folder based, and page components need to be placed on
  `+page.{tsx|ts|jsx|js}` files, same for special page components like
  `_{app|404|500}.{tsx|ts|jsx|js}` **->** `+{app|404|500}.{tsx|ts|jsx|js}` or
  `/foo/_middleware.ts` **->** `/foo/+middleware.ts`, for example. Now is
  possible to have layouts and nested layouts like SvelteKit with files like
  `/+layout.{tsx|ts|jsx|js}`.

## 🚀 Getting started

Install [Deno CLI](https://deno.land/) version 1.25.0 or higher.

You can scaffold a new project by running the Fresh init script. To scaffold a
project in the `deno-citric-demo` folder, run the following:

```sh
deno run -A -r https://fresh-citric.deno.dev deno-citric-demo
```

Then navigate to the newly created project folder:

```
cd deno-citric-demo
```

From within your project folder, start the development server using the
`deno task` command:

```
deno task start
```

Now open http://localhost:8000 in your browser to view the page. You make
changes to the project source code and see them reflected in your browser.

To deploy the project to the live internet, you can use
[Deno Deploy](https://deno.com/deploy):

1. Push your project to GitHub.
2. [Create a Deno Deploy project](https://dash.deno.com/new).
3. [Link](https://deno.com/deploy/docs/projects#enabling) the Deno Deploy
   project to the **`main.ts`** file in the root of the created repository.
4. The project will be deployed to a public $project.deno.dev subdomain.

For a more in-depth getting started guide, visit the
[Getting Started](https://fresh.deno.dev/docs/getting-started) page in the Fresh
docs.
