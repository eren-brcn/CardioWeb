# CardioWeb Frontend

CardioWeb is the frontend app for tracking workouts, following category-based exercise guides, and monitoring personal progress over time.

It focuses on a simple flow:
- add workouts
- explore the workout library
- build your own programs
- track progress with charts

## Live Links
- Frontend: https://cardio-web.vercel.app
- Backend API: https://cardio-backend-1-lq31.onrender.com

## What Is Included
- Auth flow: signup, login, protected pages
- Workout tracking: add, search, list, delete
- Profile analytics: progress charts and summary
- Program center: create and manage personal programs
- Workout library: local + WGER-backed category detail pages
- Settings: export account data and delete account flow
- Legal pages: privacy, support, terms
- i18n support: English, Turkish, German, French, Spanish

## Tech Stack
- React 19
- Vite 6
- Material UI 7
- React Router
- Axios
- Recharts
- i18next + react-i18next

## Local Setup
1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in project root:

```env
VITE_API_URL=https://cardio-backend-1-lq31.onrender.com
VITE_WGER_API_URL=https://wger.de/api/v2
```

3. Start development server:

```bash
npm run dev
```

4. Build for production (optional local check):

```bash
npm run build
npm run preview
```

## Main Routes
- /
- /profile
- /settings
- /categories
- /categories/:categoryName
- /login
- /signup
- /privacy
- /support
- /terms

## API Expectations
The frontend expects these backend route groups to exist:
- /auth
- /users
- /programs
- /exercises
- /categories
- /health

## Notes
- Language choice is stored in localStorage.
- Protected pages redirect when session is missing.
