# Stage 1 - Build the Nuxt app
FROM node:20-slim as builder

WORKDIR /app

# Install required OS packages
RUN apt-get update && apt-get install -y \
  git \
  && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build it
COPY . .
RUN npm run build

# Stage 2 - Setup production image with Playwright + Chromium
FROM mcr.microsoft.com/playwright:v1.43.1-jammy as runner

WORKDIR /app

# Copy only what's needed from the builder
COPY --from=builder /app/.output .output
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.nuxt .nuxt
COPY --from=builder /app/public public

# Optionally install only prod deps
# RUN npm ci --omit=dev

# Tell Nuxt to use production mode
ENV NODE_ENV=production

# Set proper executable path for Playwright Chromium
ENV PLAYWRIGHT_BROWSERS_PATH=0

# Expose port
EXPOSE 3000

# Start the Nuxt app
CMD ["node", ".output/server/index.mjs"]
