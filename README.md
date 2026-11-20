# Docker template

Docker-based development environment template for full-stack applications.

## Quick start

```shell
cp .env.example .env
docker compose up -d
```

- Frontend: http://localhost:3000
- Server: http://localhost:3100

## Without Docker

Install Rust, Node.js and pnpm as described in [front/README.md](front/README.md).
Then start only the database in Docker:

```shell
cp .env.example .env
docker compose up -d app-db
```

A local PostgreSQL on `localhost:5432` works too, as long as it has the role and database from `.env`. Run the server and the frontend in separate terminals:

```shell
cd server
cargo run
```

```shell
cd front
pnpm install
pnpm dev
```

The server reads `DATABASE_URL` from `.env`, and the frontend proxies `/api` to
`localhost:3100`.

## Features

- **Docker-based development**: No need to install Runtime dependencies locally
- **Hot reload**: Live code changes for both frontend and server
- **Volume mounts**: Code changes reflect immediately in containers

## Structure

- `front/` - React frontend with TypeScript + Rsbuild
- `server/` - Rust server with Axum + SQLx (PostgreSQL)
