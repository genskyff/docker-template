# Docker template

Docker-based development environment template for full-stack applications.

## Quick start

```shell
docker compose up -d
```

- Server: http://localhost:3001
- Web: http://localhost:3000

## Features

- **Docker-based development**: No need to install Node.js or Rust locally
- **Hot reload**: Live code changes for both web and server
- **Volume mounts**: Code changes reflect immediately in containers

## Structure

- `server/` - Rust server with Axum
- `web/` - React web with TypeScript
