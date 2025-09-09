### Business Cards App

A Node.js/Express REST API for managing users and business cards with authentication, authorization, validation, logging, and MongoDB (local/Atlas) support.

### Features

- **Auth**: JWT-based login with payload {\_id, isBusiness, isAdmin}
- **Authorization**: Route protections for user/admin/business actions
- **Validation**: Joi validation for request bodies
- **Hashing**: bcryptjs for passwords (hash on register, compare on login)
- **Logging**: morgan logger with timestamp, method, URL, status, response time
- **CORS**: Whitelist of allowed origins
- **Environments**: Local MongoDB or Atlas via config/env
- **Initial data**: Generates 3 users (regular, business, admin) and 3 cards
- **Models**: Mongoose models for `User` and `Card`

### Tech Stack

- **Runtime**: Node.js, Express
- **DB**: MongoDB (Mongoose)
- **Auth**: JSON Web Token
- **Validation**: Joi
- **Security**: bcryptjs
- **Config**: config + dotenv
- **Logging**: morgan

### Project Structure

- `root/server.js`: App entry; middleware, routes, error handler, DB connect, seeding
- `root/router/router.js`: Mounts routes; 404 handler
- `root/users/*`: Users routes, services, validations, models, helpers
- `root/cards/*`: Cards routes, services, validations, models, helpers
- `root/auth/*`: JWT provider and auth middleware
- `root/DB/*`: Environment-based DB connection (local/Atlas)
- `root/logger/*`: Morgan logger
- `root/middlewares/cors.js`: CORS configuration
- `root/utils/errorHandler.js`: Error helpers
- `root/initialData/*`: Seeding logic and data

### Setup

- Requirements: Node.js, MongoDB (local optional), Atlas account (optional)

- Install dependencies:

```bash
npm install
```

- Environment variables (`.env` in `root/`):

```
# JWT
JWT_KEY=your_long_random_secret

# MongoDB (choose one)
# Single URI (recommended; includes db name)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/business_card_app?retryWrites=true&w=majority

# OR parts (if your code composes a URI)
DB_NAME=<atlas_db_username>
DB_PASSWORD=<atlas_db_password>
MONGO_DB=business_card_app
```

- Git ignore:

```
.env
```

### Run

- Development (local MongoDB):

```bash
npm run dev
```

- Production (Atlas):

```bash
npm run start
```

On boot:

- Connects to DB based on `NODE_ENV`
- Seeds initial users and cards (idempotent for users; cards require valid `bizNumber` generation)

### API Overview

- Base path: `/`

- Users (`/users`)

  - `POST /users`: Register new user (Joi validated; password hashed)
  - `POST /users/login`: Login; returns JWT
  - `GET /users` (auth, admin): List users
  - `GET /users/:id` (auth, admin or owner): Get user
  - `PUT /users/:id` (auth, owner): Update user (Joi validated)
  - `PATCH /users/:id` (auth, admin or owner): Toggle `isBusiness`
  - `DELETE /users/:id` (auth, admin or owner): Delete user

- Cards (`/cards`)

  - `GET /cards`: List all cards
  - `GET /cards/my-cards` (auth): List cards for current user
  - `GET /cards/:id`: Get card by id
  - `POST /cards` (auth, business): Create card (Joi validated; `bizNumber` generated)
  - `PUT /cards/:id` (auth, owner): Update card (Joi validated)
  - `PATCH /cards/:id` (auth): Like/unlike card
  - `DELETE /cards/:id` (auth, owner or admin): Delete card

- Auth header:

```
x-auth-token: <JWT>
```

### Validation and Errors

- Joi schemas validate request bodies for users/cards
- Validation failures mapped to HTTP 400
- Auth failures return 401; authorization failures return 403
- Not found returns 404
- `utils/errorHandler.js` centralizes responses and logging

### Logging and CORS

- Morgan logs: date, method, URL, status, response time (colored)
- CORS allows configured origins (local dev and Vite/Live Server defaults)

### Environments and DB

- `development`: local MongoDB at `mongodb://localhost:27017/business_card_app`
- `production`: Atlas via `MONGODB_URI` or composed from `DB_NAME`/`DB_PASSWORD`
- Ensure Atlas Database User exists and IP is whitelisted

### Notes

- Do not commit secrets; use `.env` and hosting env configuration
- If your Atlas password contains special characters, URL-encode it in `MONGODB_URI`
- `bizNumber` should be 9 digits; generator and schema set accordingly

### Scripts

- `npm run dev`: development with nodemon
- `npm run start`: production mode

### License

ISC (adjust as needed)
