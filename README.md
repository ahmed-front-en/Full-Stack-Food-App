# Full-Stack-Food-App — Recipe Sharing (Course Training Project)

> A **course/training full-stack project** demonstrating MERN-style development: an Express + MongoDB backend and a Vite + React frontend for sharing recipes.
> This is **not** a production-grade system: it has no automated tests, no deployment, no payment features, and only basic security. It is an honest record of a learning project.

## Overview

Two parts live in one repository:

```
Full-Stack-Food-App/
└── BackEnd/
    ├── server.js                    # Express backend entry (port default 3000)
    ├── config/connectionDB.js       # Mongoose connection (MONGO_URI)
    ├── models/                      # Mongoose schemas (Recipe, User)
    ├── routes/                      # /recipe CRUD + /user auth endpoints
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
| PUT | `/recipe/:id` | Update a recipe |
| DELETE | `/recipe/:id` | Delete a recipe |
| POST | `/user/register` | Register (email + password) → hashed with bcryptjs, returns JWT |
| POST | `/user/signin` | Sign in → JWT (validates via bcryptjs `compare`) |
| GET | `/user/:id` | Get a user by id (effectively shadowed — see note) |

**Notes on routing discovered in the source:**

- `routes/user.js` imports the recipe router from `routes/recipe.js` and exports it, so the recipe CRUD routes are also reachable under `/user/*`.
- The JWT is issued on register/signin but **no middleware protects any recipe route** — creating, updating, and deleting recipes does not require a token.
- The frontend logs in via `/user/register` and `/user/signin`, which matches the actual route registration.

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `MONGO_URI` | MongoDB connection string (used by `config/connectionDB.js`) |
| `SECRET_KEY` | JWT signing secret (used by `routes/user.js`) |
| `PORT` | Server port (**defaults to 3000**) |

No `.env.example` or `.env` is committed (`.env*` is git-ignored).

### Running the backend

```bash
cd BackEnd
npm install
# set MONGO_URI (and optionally SECRET_KEY, PORT) in a .env file
npm run dev    # nodemon server.js
```

The server logs `Server is running on port 3000` and fails gracefully if `MONGO_URI` is not set (verified).

## Frontend

**Stack:** Vite, React 19 (JSX), React Router 7, Bootstrap 5, `axios`, `react-icons`.

### Pages & components (verified in `src/App.jsx`)

| Route | Component | Notes |
|-------|-----------|-------|
| `/` | `Home` | Hero + `AllRecipes` grid; "Share Your Recipe" opens login modal unless a token exists |
| `/myRecipes` | `MyResipes` | Lists recipes filtered client-side by `recipe.createdBy === user._id` |
| `/myFavRecipes` | `MyFavResipes` | Placeholder page ("MyFavResipes" text only) |
| `/addRecipe` | `AddResipes` | `multipart/form-data` form for a new recipe |
| *(unrouted)* | `pages/EditRecipe.jsx` | Exists on disk but is **not** registered in `App.jsx` |

The login modal (`ImputForm`) posts to `/user/register` or `/user/signin` and stores `token` and `user` in `localStorage`.

### API base URL

The frontend **hardcodes** `http://localhost:5000` for all API calls (e.g. `axios.get('http://localhost:5000/recipe')`). The backend **defaults to port 3000**. To run both locally, set `PORT=5000` in the backend `.env`.

## Known Gaps & Limitations (verified in source — do not claim otherwise)

- **No authentication enforcement** — JWTs are issued but recipe routes have no auth middleware; the frontend merely checks for a stored token to show the "add recipe" form.
- **Image upload is not functional end-to-end** — `AddResipes` sends `multipart/form-data`, but the backend uses `express.json()`, has no `multer`/file handling, and never serves static files; `coverImage` is not persisted by the recipe route, and `MyResipes` references `/public/images/...` which is not served.
- **"My Recipes" filter always returns empty** — `MyResipes` filters by `recipe.createdBy`, a field that does not exist in `RecipeSchema` and is never written on create.
- **Favorites are placeholders** — the heart icons are decorative and the favorites page renders static text only.
- **Edit recipe page is unreachable** — `EditRecipe.jsx` is not mapped to a route in `App.jsx`.
- **Port mismatch** between the hardcoded frontend base URL (5000) and backend default (3000) unless configured.
- **No automated tests**, no CI, no deployment, no rate limiting, no validation library.
- Dependencies include `axios` (unused in the backend) and `bcrypt` (removed in this documentation pass — `bcryptjs` is the hashing library actually used).

## What Works (as verified)

- Recipe **create / read / update / delete** against MongoDB (Mongoose).
- User **register / signin** with bcryptjs hashing and JWT generation.
- Frontend **recipe listing** from the backend and the add-recipe form UI.
- Frontend `npm run build` passes (Vite build verified).
- Backend boots and serves `/recipe` + `/user` routes (requires a MongoDB instance for data operations).

## Installation Summary

```bash
# Backend
cd BackEnd
npm install
echo "MONGO_URI=mongodb://localhost:27017/recipe-app" > .env
PORT=5000 npm run dev

# Frontend (separate terminal)
cd BackEnd/frontEnd/recipe-app
npm install
npm run dev
```

Open the frontend at `http://localhost:5173`. The frontend expects the backend on `http://localhost:5000`.

## License

No license file is present in this repository.