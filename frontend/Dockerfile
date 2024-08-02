FROM node:lts
WORKDIR /frontend
COPY . .
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm run build
EXPOSE 9001
CMD ["pnpm","run","preview"]
