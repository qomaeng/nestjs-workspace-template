###################
#     Builder
###################

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm                           \
  --filter '@template/workspace' \
  --filter '{packages/*}'        \
  --filter '{apps/auth-service}' \
  install --frozen-lockfile

# Build packages & application
RUN pnpm                         \
  --filter '{packages/*}'        \
  --filter '{apps/auth-service}' \
  build
FROM node:22-alpine AS builder

RUN pnpm --filter '{apps/auth-service}' deploy --prod /app

###################
#   Application
###################
FROM node:22-alpine

COPY --from=builder /app /app
WORKDIR /app

EXPOSE 6002

CMD [ "node", "./dist/main.js" ]
