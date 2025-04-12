# Use Node.js 20 (same as your PC) with Alpine for smaller size
FROM node:20-alpine

# Set app directory inside container
WORKDIR /app

# Copy only package.json and lock file first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy rest of the project files
COPY . .

# Expose port 3000 for Next.js dev server
EXPOSE 3000

# Start Next.js in dev mode
CMD ["npm", "run", "dev"]
