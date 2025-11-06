FROM node:lts-alpine

ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /app-web

RUN npm update -g && npm cache clean -f && corepack enable

EXPOSE 3000
