# DevCamper API

## Table of Contents

- [DevCamper API](#devcamper-api)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Installation](#installation)
  - [API Documentation](#api-documentation)
  - [Infrastructure Design](#infrastructure-design)
  - [Infrastructure Details](#infrastructure-details)
    - [VPC and Subnets](#vpc-and-subnets)
    - [Components](#components)
    - [Data Flow](#data-flow)
    - [Network Security](#network-security)
  - [Author](#author)

## Description

DevCamper is a RESTful API that provides a platform for bootcamps, courses, reviews and users. It allows users to create, read, update and delete bootcamps, courses, reviews and users. The API also provides user authentication and authorization, password encryption, image upload, geocoding, pagination, filtering, sorting, querying, custom error handling middleware, rate limiting, cross-origin resource sharing (CORS), security headers, helmet, XSS protection, HPP protection, sanitization and logging. The API is documented using Postman.

## Features

- [x] Full CRUD functionality for bootcamps, courses, reviews and users
- [x] User authentication and authorization
- [x] Password encryption
- [x] Image upload
- [x] Geocoding
- [x] Pagination, filtering, sorting and querying
- [x] Custom error handling middleware
- [x] Rate limiting
- [x] Cross-origin resource sharing (CORS)
- [x] Security headers
- [x] Helmet
- [x] XSS protection
- [x] HPP protection
- [x] Sanitization
- [x] Logging
- [x] API documentation

## Technologies

- [AWS EC2](https://aws.amazon.com/ec2/): for deployment.
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling tool
- [JWT](https://jwt.io/): Secure user authentication.
- [bcryptjs](https://www.npmjs.com/package/bcryptjs): Password encryption.
- [express-fileupload](https://www.npmjs.com/package/express-fileupload): File upload.
- [node-geocoder](https://www.npmjs.com/package/node-geocoder): Geocoding.
- [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize): Sanitization.
- [helmet](https://www.npmjs.com/package/helmet): Security headers.
- [hpp](https://www.npmjs.com/package/hpp): HTTP parameter pollution protection.

## Installation

1. Clone the repository

```
git clone https://github.com/SymonMuchemi/DevCamper-API.git
```

2. Install dependencies

```
npm install
```

3. Create a .env file in the root directory and add the following

```
PORT=3001

MONGO_URI='your_mongo_uri'

JWT_COOKIE_EXPIRE='30d'
JWT_SECRET='your_jwt_secret'
JWT_EXPIRE='30d'

GEOCODER_PROVIDER='mapquest'
GEOCODER_API_KEY='your_geocoder_api_key'

REDIS_SET_EXPIRE=3600

REDIS_HOST='localhost'
REDIS_PORT='6379'
REDIS_PASSWORD='your_redis_password'
```

4. Populate the database with data

```
node seeder -i
```

5. Run the server

```
npm start
```

6. Access the application on `http://localhost:3001/`

## API Documentation

- Local documentation: [http://localhost:3001/](http://localhost:3001/)
- Live documentation: [link](https://51.21.253.85/)
- Postman Published Documentation: [https://documenter.getpostman.com/view/33408943/2sAYkBsghW](https://documenter.getpostman.com/view/33408943/2sAYkBsghW)

## Infrastructure Design

![Devcamper Infrastructure Design Diagram](<Devcamper Architectural Diagram with region.png>)

## Infrastructure Details

### VPC and Subnets

**DevCamper VPC**: The entire infrastructure is contained within a Virtual Private Cloud (VPC).

**Public Subnet (10.0.0.0/24)**: Contains resources that need to be accessible from the internet.

**Private Subnet (10.0.2.0/24)**: Contains resources that do not need to be directly accessible from the internet.

### Components

**Web Server (Public Subnet)**

- Handles HTTP requests from users.
- Interacts with the Redis cache for reading cached data and writing cache/stream data.
- Interacts with the NoSQL database for reading uncached data and writing new data, updates, or deletions.

**Redis Cache (Private Subnet)**

- Acts as a caching layer to store frequently accessed data.
- Also used for writing to the mail stream.

**Mail Stream (Private Subnet)**

- A stream of email messages that need to be processed.
- Written to by the web server and read by the mail worker.

**Mail Worker (Private Subnet)**

- Reads from the mail stream.
- Processes email messages and sends them to users.

**NoSQL Database (Private Subnet)**

- Stores application data that is not cached.
- Interacts with the web server for reading and writing data.

### Data Flow

**User Interaction**

- A user sends an HTTP request to the web server.

**Web Server Operations**

- The web server processes the request.
- It may read cached data from Redis.
- It writes data to the Redis cache and the mail stream.
- It reads uncached data from the NoSQL database.
- It writes new data, updates, or deletions to the NoSQL database.

**Mail Stream Processing**

- The mail worker reads from the mail stream.
- Processes the email messages and sends them to the user.

**Response to User**

- The web server sends an HTTP response back to the user.

### Network Security

**Public Subnet**: Accessible from the internet, allowing users to interact with the web server.

**Private Subnet**: Isolated from direct internet access, ensuring that Redis, the mail worker, and the NoSQL database are secure.

## Author

- [Simon Muchemi](https:www.github.com/SymonMuchemi)
