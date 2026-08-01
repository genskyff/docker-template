# Frontend

A React + TypeScript app built on Rsbuild, talking to the server over `/api`.

## Features

- **Rsbuild**: Rspack-based build tool, minimal config on top of its defaults.
- **React**: With React Compiler enabled.
- **TypeScript**: Type checked in a separate process.
- **Tailwind CSS & daisyUI**: Utility-first styling with themed components.
- **TanStack Query**: Server state, caching and invalidation.
- **React Router, Zustand, Lucide, Lodash**: Routing, client state, icons, utilities.
- **Rstest**: Rspack-powered test runner, reusing the Rsbuild config.
- **Oxlint & Oxfmt**: Rust-based linter and formatter.

## Getting Started

The usual entry point is `docker compose up -d` from the repository root, which runs
this app together with the server. To work on the frontend alone, Node.js 24 or later:

```shell
corepack enable
pnpm install
```

Requests to `/api` are proxied to the server — `app-server:3100` inside Docker,
`localhost:3100` otherwise. Without a server the todo list renders an error with a
retry button.

## Scripts

| Command        | Description                        |
| -------------- | ---------------------------------- |
| `pnpm dev`     | Start the dev server               |
| `pnpm build`   | Build for production               |
| `pnpm preview` | Serve the production build locally |
| `pnpm test`    | Run tests                          |
| `pnpm check`   | Lint and verify formatting         |
| `pnpm fix`     | Lint and format, writing fixes     |

## Layout

| Path             | Contents                             |
| ---------------- | ------------------------------------ |
| `src/api/todos/` | REST client and TanStack Query hooks |
| `src/pages/`     | Route components                     |
| `src/App.tsx`    | Layout and route table               |

The todo feature is a demo. Delete `src/api/todos` and `src/pages` to start fresh.
