# Past Papers API

This API allows students to access past exam papers for various units. The papers are categorized by unit code, year, and class. The API provides endpoints to list all papers, fetch a specific paper by unit code and year, and more.

## Table of Contents
- [Project Setup](#project-setup)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)
- [Technologies Used](#technologies-used)
- [License](#license)

## Project Setup

### Prerequisites

To get started, you'll need the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 16 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (or MongoDB Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lxmwaniky/past-paper-api.git
   cd past-paper-api
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add the following environment variables:
   ```env
    PORT=3000
    CONNECTION_STRING=<Your MONGO-DB CONNECTION URL>
    API_KEY=/api/v1
    ```

4. Start the server:
    ```bash
    npm run server
    ```

## API Endpoints

The API provides the following endpoints:

- `GET /api/v1/papers`: Fetch all papers
- `GET /api/v1/papers/:unitCode/:yearTaken`: Fetch a specific paper by unit code and year
- `GET /api/v1/papers/:unitCode`: Fetch all papers for a specific unit code
- `POST /api/v1/papers`: Add a new paper
- `PUT /api/v1/papers/:unitCode/:yearTaken`: Update a paper
- `DELETE /api/v1/papers/:unitCode/:yearTaken`: Delete a paper

## Running Tests

To run the tests, use the following command:

```bash
npm run test
```

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- Jest

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```