# Express TypeScript Docker MongoDB Project

This is a brief description or introduction to your Express TypeScript project with Docker and MongoDB integration.

## Prerequisites

Before you can run this project, ensure you have the following dependencies installed on your system:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Installation

1. Clone the repository:

```bash
git clone --depth=1 https://github.com/rebazomar121/node-typescript-mongodb-starter your-project-name
cd your-project-name
```

## Install project dependencies:

```bash
npm install
```

## Configuration

You need to create a .env file in the project root directory to configure environment variables. Here's a sample .env file:

```bash
DATABASE_URL=mongodb://localhost:27017/express-mongoose-es6-rest-api-test
JWT_SECRET_KEY=jwt-secret
ENCRYPTION_KEY=encryption-key
SMS_DOMAIN=sms-domain
SMS_API_KEY=sms-api-key
PORT=8080
```

## Running on development mode

```bash
npm run dev
```

## Running on production mode

```bash
npm run build
npm start
```

## Running with Docker

1 - Build the image:

```bash
docker build -t your-image-name .
```

2 - Run the container:

```bash
docker run -p 8080:8080 -d your-image-name
```

## Running with Docker Compose

```bash
docker-compose up -d
```

## Contact

you can contact me at <a href="mailto:info@rebaz.dev">email<a> or <a href="https://rebaz.dev">rebaz.dev</a>
let me know if you have any questions or suggestions.
