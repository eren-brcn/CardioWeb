# CardioWeb Frontend

CardioWeb is a multilingual fitness tracking frontend built with React and Vite. It provides workout tracking, user profile analytics, training guides, and personal program management.

## Live
- Frontend: https://cardio-web.vercel.app
- Backend API: https://cardio-backend-1-lq31.onrender.com

## Features
- Authentication: signup/login with JWT session handling
- Workout management: add, list, search, and delete exercises
- Profile analytics: progress charts (bar and line) based on personal workout history
- Program center: create and manage personal workout programs
- Training guides: category detail pages plus WGER exercise library integration
- Legal/support pages: privacy, support, and terms
- Internationalization: English, Turkish, German, French, Spanish

## Tech Stack
- React 19 + Vite 6
- Material UI 7
- React Router
- Axios
- Recharts
- i18next + react-i18next

## Environment Variables
Create an .env.local file with:

```env
VITE_API_URL=https://cardio-backend-1-lq31.onrender.com
VITE_WGER_API_URL=https://wger.de/api/v2
```

## Run Locally
Install dependencies and start dev server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Main Routes
- / (dashboard)
- /profile
- /categories
- /categories/:categoryName
- /login
- /signup
- /privacy
- /support
- /terms

## Notes
- All user-facing pages use route-based protection where required.
- Language preference is persisted in localStorage.
- The frontend expects the backend to expose /auth, /users, /programs, /exercises, /categories, and /health endpoints.
