FROM node:lts-trixie

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

WORKDIR /app-web

RUN corepack enable && corepack prepare pnpm@latest --activate

EXPOSE 3000
