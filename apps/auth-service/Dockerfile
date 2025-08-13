###################
#     Builder
###################
FROM node:22.18.0-alpine3.22 AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack use pnpm@10.14.0

COPY . /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm \
  --filter '@template/workspace' \
  --filter '{packages/*}'    \
  --filter '{apps/auth-service}' \
  install --frozen-lockfile

# Build packages & application
RUN pnpm \
  --filter '{packages/*}'    \
  --filter '{apps/auth-service}' \
  build

RUN pnpm --filter '{apps/auth-service}' deploy --prod /app

###################
#   Application
###################
FROM node:22.18.0-alpine3.22

COPY --from=builder /app /app
WORKDIR /app

EXPOSE 6002

CMD [ "node", "./dist/main.js" ]
