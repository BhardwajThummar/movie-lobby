# Movies lobby Backend

# Movies APIs

## Overview

This project is a secure and scalable backend which uses REST API. Users can list movies and search for movies based on keywords. The backend is implemented using Node.js, Express, and MongoDB.

## Features

- **Authentication:** Users can sign up and log in to view their movies securely.
- **Movie Operations:** Create, read, update, and delete movies.
- **Search Functionality:** Search for movies based on keywords.
- **Caching:** Caching is implemented to improve performance.

## Tech Stack

- **Node.js**
- **Express**
- **MongoDB**
- **Passport.js (for authentication)**
- **Joi (for validation)**
- **Mongoose (for MongoDB interactions)**
- **Chai/Mocha (for testing)**

## Setup

1. Clone the repository.


2. Install dependencies.

    SHOULD HAVE MONDODB INSTALLED IN YOUR SYSTEM IF YOUR ARE RUNNING LOCALLY


3. Create a `.env` file in the project root and set environment variables.

    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/movie-lobby
    JWT_SECRET="byOPe;(M0$#t;k,S1+FO^=nw4OG_q$p420P{H4|;0cG5Z3q%}4%:ts,$K;.xvzG"
    CACHE_EXPIRY_TIME=100


4. Run the application in development mode.


## Testing

Run tests using the following command:

npm test / yarn test

## Contributing

Feel free to contribute by opening issues and pull requests. Follow the project's coding style and conventions.

## License

This project is licensed under the [MIT License](LICENSE).
