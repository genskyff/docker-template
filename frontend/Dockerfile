FROM node:lts
WORKDIR /app
COPY . .
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm run build
EXPOSE 8080
CMD ["npm","run","preview"]
