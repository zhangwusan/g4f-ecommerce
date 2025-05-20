# Step 1: Use an official Node.js image as the base image
FROM node:lts-alpine3.21

# Step 2: Set working directory
WORKDIR /app

# Step 3: Install required Alpine packages (if needed, e.g., perl)
RUN apk add --no-cache perl

RUN npm install -g @nestjs/cli
# Step 4: Copy package files and install dependencies
COPY package*.json ./

# Step 5: Copy the rest of your code
COPY . .

# Step 6: Make entrypoint.sh executable
RUN chmod +x ./entrypoint.sh

# Step 8: Expose the app port
EXPOSE 4400

# Step 9: Set entrypoint
ENTRYPOINT ["sh", "./entrypoint.sh"]