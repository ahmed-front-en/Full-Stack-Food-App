# Full-Stack-Food-App — Recipe Sharing (Course Training Project)

> A **course/training full-stack project** demonstrating MERN-style development: an Express + MongoDB backend and a Vite + React frontend for sharing recipes.
> This is **not** a production-grade system: it has no automated tests, no deployment, no payment features, and only basic security. It is an honest record of a learning project.

## Overview

Two parts live in one repository:

```
Full-Stack-Food-App/
└── BackEnd/
    ├── server.js                    # Express backend entry (port default 5000)
    ├── config/connectionDB.js       # Mongoose connection (MONGO_URI)
    ├── models/                      # Mongoose schemas (Recipe, User)
    ├── middlewares/auth.js          # JWT verification for protected routes
    ├── routes/                      # /recipe CRUD + /user auth endpoints
    ├── public/images/               # Uploaded recipe cover images (served statically)
    └── frontEnd/recipe-app/         # Vite + React frontend
```

## Backend

**Stack:** Node.js (CommonJS), Express 5, MongoDB via Mongoose 7, `bcryptjs` for password hashing, `jsonwebtoken` for JWT issue, `cors`, `axios`, `dotenv`.

### Endpoints (verified from `server.js` + route files)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/recipe` | List all recipes |
| POST | `/recipe` | Create a recipe (`title`, `ingredients`, `instructions` required) |
| GET | `/recipe/:id` | Get one recipe |
| PUT | `/recipe/:id` | Update a recipe (**requires JWT**) |
| DELETE | `/recipe/:id` | Delete a recipe (**requires JWT**) |
| POST | `/user/register` | Register (email + password) → hashed with bcryptjs, returns JWT |
| POST | `/user/signin` | Sign in → JWT (validates via bcryptjs `compare`) |
| GET | `/user/:id` | Get a user by id |

**Notes on routing discovered in the source:**

- `POST /recipe` accepts `multipart/form-data` (`title`, `ingredients`, `instructions`, optional `coverImage` file) and records `createdBy` from the verified JWT (`Authorization: Bearer <token>`).
- Cover images are stored under `BackEnd/public/images/` and served from `/public/images/<filename>`.
- Recipe routes that mutate data (create/update/delete) require a valid JWT; listing and single-recipe reads are public.
- The `user.js` router no longer re-exports the recipe router, so recipe CRUD is only reachable under `/recipe`. The `/user/:id` route correctly resolves against the `User` collection.

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `MONGO_URI` | MongoDB connection string (used by `config/connectionDB.js`) |
| `SECRET_KEY` | JWT signing secret (used by `routes/user.js` and `middlewares/auth.js`) |
| `PORT` | Server port (**defaults to 5000**, matching the frontend base URL) |

No `.env.example` or `.env` is committed (`.env*` is git-ignored).

### Running the backend

```bash
cd BackEnd
npm install
# set MONGO_URI (and optionally SECRET_KEY, PORT) in a .env file
npm run dev    # nodemon server.js
```

The server logs `Server is running on port 5000` and fails gracefully if `MONGO_URI` is not set (verified).

## Frontend

**Stack:** Vite, React 19 (JSX), React Router 7, Bootstrap 5, `axios`, `react-icons`.

### Pages & components (verified in `src/App.jsx`)

| Route | Component | Notes |
|-------|-----------|-------|
| `/` | `Home` | Hero + `AllRecipes` grid; "Share Your Recipe" opens login modal unless a token exists |
| `/myRecipes` | `MyResipes` | Lists recipes filtered client-side by `recipe.createdBy === user._id` |
| `/myFavRecipes` | `MyFavResipes` | Placeholder page ("MyFavResipes" text only) |
| `/addRecipe` | `AddResipes` | `multipart/form-data` form for a new recipe (protected behind login) |
| `/EditRecipe/:id` | `pages/EditRecipe` | Edit an existing recipe (linked from "My Recipes") |

The login modal (`ImputForm`) posts to `/user/register` or `/user/signin` and stores `token` and `user` in `localStorage`.

### API base URL

The frontend calls `http://localhost:5000` for all API calls (e.g. `axios.get('http://localhost:5000/recipe')`). The backend **defaults to port 5000**, so `npm run dev` in `BackEnd/` and `npm run dev` in the frontend work together with no extra configuration.

## Known Gaps & Limitations (verified in source — do not claim otherwise)

- **Favorites are placeholders** — the heart icons are decorative and the favorites page (`/myFavRecipes`) renders static text only; there is no favorites model or endpoint.
- **No automated tests**, no CI, no deployment, no rate limiting, no validation library.
- **Basic security** — uploads are not sanitized/type-restricted beyond `multer` defaults, and there is no ownership check on edit/delete (any logged-in user can edit/delete any recipe).
- Dependencies include `axios` (unused in the backend).

## What Works (as verified)

- Recipe **create / read / update / delete** against MongoDB (Mongoose), with `createdBy` recorded for new recipes.
- User **register / signin** with bcryptjs hashing and JWT generation; recipe create/update/delete are protected via JWT verification (`middlewares/auth.js`).
- Cover image **upload** (`multer`), persistence of the filename in `coverImage`, and static serving from `/public/images/...`.
- **My Recipes** filters recipes created by the logged-in user; **Edit recipe** is routed at `/EditRecipe/:id` and linked from My Recipes.
- Frontend `npm run build` and `npm run lint` build checks verified.
- Backend boots on port 5000 and serves `/recipe` + `/user` routes (requires a MongoDB instance for data operations).

## Installation Summary

```bash
# Start MongoDB (any local instance is fine)
docker run -d --name recipe-mongo -p 27017:27017 mongo:7

# Backend
cd BackEnd
npm install
echo "MONGO_URI=mongodb://localhost:27017/recipe-app" > .env
echo "SECRET_KEY=replace-with-a-random-secret" >> .env
npm run dev

# Frontend (separate terminal)
cd BackEnd/frontEnd/recipe-app
npm install
npm run dev
```

Open the frontend at `http://localhost:5173`. The frontend expects the backend on `http://localhost:5000`.

## License

No license file is present in this repository.