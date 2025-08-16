FROM node:20-alpine AS base

WORKDIR /app

# Enable Corepack and activate Yarn classic
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy sources
COPY tsconfig.json ./tsconfig.json
COPY next.config.mjs ./next.config.mjs
COPY public ./public
COPY src ./src

# Build-time backend URL for Next.js
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Build Next.js
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start", "-p", "3000", "-H", "0.0.0.0"]


