# Exodia 4.0

All Kerala Technical Learning Gala

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

## Registration configuration

The frontend connects to `https://api.exodiacec.in` by default. To use a local
registration API, set `NEXT_PUBLIC_REGISTRATION_API_URL` in an ignored
`.env.local` file. This value is included in the browser bundle, so it must be a
public API URL without credentials. Production builds use HTTPS and reject
loopback API addresses.

The registration service runs separately. The optional `api:*` and `db:*`
commands require the local, ignored `worker/` directory; they are not needed to
install, build, or run this frontend. Keep backend secrets, local databases,
planning files, and generated output out of Git.

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
```

When the ignored local `scripts/check-structure.ts` helper is available, run it
with `bun scripts/check-structure.ts` before committing.
