# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.19.0
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

# Dependencies stage (dev and build)
FROM base AS deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Development stage
FROM deps AS dev
ENV NODE_ENV development

EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build stage
FROM deps AS build
COPY . .
RUN npm run build

# Production dependencies stage
FROM base AS prod-deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Final stage
FROM base as final
ENV NODE_ENV production

USER node

COPY package.json .
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/. ./.

EXPOSE 3000
CMD ["npm", "start"]
