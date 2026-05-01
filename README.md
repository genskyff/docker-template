# Docker template

Docker-based development environment template for full-stack applications.

## Quick start

```shell
docker compose up -d
```

- Frontend: http://localhost:3000
- Server: http://localhost:3001


## Features

- **Docker-based development**: No need to install Runtime dependencies locally
- **Hot reload**: Live code changes for both frontend and server
- **Volume mounts**: Code changes reflect immediately in containers

## Structure

- `front/` - React frontend with TypeScript
- `server/` - Rust server with Axum
