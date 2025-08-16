FROM node:20-slim AS base

WORKDIR /app

# Ensure sqlite3 native deps exist
RUN apt-get update && apt-get install -y --no-install-recommends sqlite3 ca-certificates && rm -rf /var/lib/apt/lists/*
# Enable Corepack and activate Yarn classic
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy sources
COPY tsconfig.json ./tsconfig.json
COPY knexfile.js ./knexfile.js
COPY migrations ./migrations
COPY src ./src

# Ensure data dir exists for sqlite persistence
RUN mkdir -p /app/data

# Build TypeScript
RUN yarn build

ENV NODE_ENV=production
VOLUME ["/app/data"]
EXPOSE 3001

# Run migrations then start server
CMD sh -c "yarn migrate && yarn start"


