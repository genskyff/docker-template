FROM node:lts-trixie
WORKDIR /frontend
COPY . .
RUN corepack enable
RUN pnpm install --frozen-lockfile
RUN pnpm build
