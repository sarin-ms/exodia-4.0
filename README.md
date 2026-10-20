# Exodia 4.0

All Kerala Techinal Learning Gala

## Stack

- Next.js 16.4.2 and React 19.3.
- Strict TypeScript, CSS Modules, and ESLint.
- Bun 1.4.3 for dependency management and scripts; `bun.lock` is the only lockfile.
- Node.js 22 for the standard Next.js runtime/build compatibility.

## Run

```sh
bun install
bun run dev
```

Open `http://localhost:3000`.

```sh
bun run typecheck
bun run lint
bun run build
bun run start
```

`bun run start` serves an existing production build.

## Folder and file conventions

```text
app/
  components/
    Hero/
      index.tsx              # default function Hero
      Hero.module.css        # component-scoped CSS
  styles/
    tokens.css               # shared design tokens
  globals.css                # reset and base styles
  layout.tsx                 # document shell and metadata
  page.tsx                   # route composition
public/
  fonts/
    spin-cycle.ttf           # original brand font
scripts/
  check-structure.ts
```
