# build stage
FROM node:22.6-alpine3.20 AS build-stage
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app
COPY package.json .

RUN corepack enable \
    && corepack prepare pnpm@9.7.1 --activate \
    && pnpm add -g @quasar/cli

# Instala dependecias y Transpila
RUN pnpm install
RUN pnpm install @vue/runtime-core
COPY . .
RUN quasar build -m pwa

# production stage
FROM nginx:1.27.1 AS production-stage
#COPY --from=build-stage /app/dist/pwa /usr/share/nginx/html/agroforestal
COPY --from=build-stage /app/dist/pwa /usr/share/nginx/html
COPY nginx-conf/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
