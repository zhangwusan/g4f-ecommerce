# Use full Node image with dev tools
FROM node:20-alpine

# Set working directory
WORKDIR /app

RUN npm install -g next@latest
# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm install --force

# Copy source code
COPY . .

# Expose port used by Next.js dev server
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev"]