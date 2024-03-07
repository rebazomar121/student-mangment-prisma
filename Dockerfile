FROM node:18.13.0-alpine
# Update packages
RUN apk update
# Create root application folder
WORKDIR /app
# Copy configs to /app folder
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy source code to /app/src folder
COPY . .
# Check Node.js version
RUN node --version
# Build the application
RUN npm run build
EXPOSE 8080
CMD [ "npm", "start" ]