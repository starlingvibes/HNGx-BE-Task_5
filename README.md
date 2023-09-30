---

# Cloud Backup Service API

The Cloud Backup API is a backend service that powers a cloud backup system. It allows users to securely create accounts and manage their backups in the cloud. This API is built using Google Cloud, Redis, ExpressJS, NodeJS, PostgreSQL, TypeScript and Jest for testing.

## Features

- Upload files: users can upload files (including photos and videos) of not more than 200MB.
- View files: users can view all the files they created.
- Secure Backup Storage: user files are securely stored on the cloud.
- API Testing: Comprehensive unit tests are implemented using Jest.


## API Endpoints
### Upload   functionalities
- `POST /api/v1/storage/upload`: Upload a file to the backup service
- `GET /api/v1/storage/list`: Get all files created by the user 

### Transcription functionalities
- `POST /api/v1/transcribe`: Transcribe a video file url to text
 
## Database Setup:

   - Launch a PostgreSQL shell and login using `psql -U <username>`.
   - Create a new database using `CREATE DATABASE "hngx_5";`.
   - Connect to the database using `\c hngx_5`.
   - Start the server, it will automatically describe the necessary tables

## Prerequisites

- Node.JS (v14.^.^ or higher)
- PostgreSQL database
- Postman for testing the API

## Installation

1. Clone the repository:

```bash
git clone https://github.com/starlingvibes/hngx-be-task_5.git
```

2. Navigate to the project directory:

```bash
cd hngx-be-task_5
```

3. Install dependencies:

```bash
yarn add package.json
```

4. Create a `.env` file in the project root and set the following environment variables:

```env
# server settings
PORT=8000

# database settings
DB_HOST=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=cloud_backup

# redis configuration
REDIS_URL=

# application secrets
JWT_SECRET_USER=
JWT_SECRET_ADMIN=
ADMIN_TOKEN=

# whisper api configuration
WHISPER_API_KEY=
WHISPER_API_URL=
```

5. Set up your PostgreSQL database with the provided configuration.

6. Create a Google Cloud Storage bucket and download the JSON credentials file. Save it as `storage-keys.json` in the project root directory.

7. Create a Redis instance and set the environment variables in the `.env` file.

8. Start the server:

```bash
yarn start:dev
```


## Testing

The API includes unit tests implemented using Jest.

To run tests:

```bash
yarn test
```

## Postman Collection

You can find a Postman collection with example API requests in the `docs` directory. Import this collection into Postman to test the API endpoints.

## Contributing

Contributions to this project are welcome! Feel free to submit issues and pull requests.
For any inquiries or questions, feel free to contact [dera@ieee.org](mailto:dera@ieee.org).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
