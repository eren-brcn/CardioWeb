# CardioWeb

CardioWeb is a workout tracking app.

You can:
- log workouts
- build simple training programs
- track progress with charts
- follow other users and view leaderboard stats
- track meals and body measurements

## Live
- Frontend: https://cardio-web.vercel.app
- Backend API: https://cardio-backend-1-lq31.onrender.com

## Tech
- React + Vite
- Material UI
- React Router
- Axios
- Recharts
- i18next

## Quick Start
1. Install packages

```bash
npm install
```

2. Create `.env.local`

```env
VITE_API_URL=https://cardio-backend-1-lq31.onrender.com
VITE_WGER_API_URL=https://wger.de/api/v2
```

3. Run app

```bash
npm run dev
```

4. Optional production check

```bash
npm run build
npm run preview
```

## Main Pages
- `/`
- `/profile`
- `/leaderboard`
- `/settings`
- `/categories`
- `/categories/:categoryName`
- `/programs/:programId`
- `/users/:userId`
- `/login`
- `/signup`

## Features
- Authentication (signup/login)
- Workout logging and progress charts
- Program builder with phases
- Nutrition tracker (meals + calories/macros)
- Social profiles + follow/unfollow + leaderboard
- Body measurements and goals
- Data export + account delete
- Multi-language support (EN, TR, DE, FR, ES)

## Notes
- This frontend needs the backend running with matching API routes.
- If the app looks empty, check `VITE_API_URL` first.
