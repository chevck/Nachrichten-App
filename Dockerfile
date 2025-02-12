# Build stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application code
COPY . .

# ARG for build-time environment variables
ARG REACT_APP_NEWS_API
ARG REACT_APP_WORLD_NEWS_API
ARG REACT_APP_GUARDIAN_NEWS_API
ARG REACT_APP_NEW_YORK_NEWS_API

# Build the application with environment variables
RUN npm run build

# Install serve package globally
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Instead of building, start in development mode
CMD ["npm", "start"]
