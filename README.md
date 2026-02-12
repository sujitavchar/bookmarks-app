# Bookmark Dashboard

A simple dashboard to manage personal bookmarks using **Supabase** for authentication and storage. Users can add, view, and delete bookmarks in real-time.

---

## Features

- Google-based authentication via Supabase
- Add bookmarks with title and URL
- View bookmarks in descending order of creation
- Delete bookmarks
- Real-time updates using Supabase Realtime

---

## Tech Stack

- React / Next.js (Client-side rendering)
- Supabase (Auth + Database + Realtime)
- TypeScript
- TailwindCSS (optional styling)

---

## Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd <repo-folder>
npm install
#or
yarn install

npm run dev
# or
yarn dev
```

## Problems Faced & Solutions

1. Problem: 400 Bad Request when fetching bookmarks
Cause: Supabase query tried to filter user_id = null before user was authenticated.
Solution: Added a check to fetch bookmarks only after userId is available:
        Updated useEffect for realtime subscription to depend on [userId].

2. Problem: userId and userEmail logged as null immediately after setState
Cause: React state updates are asynchronous; the value isn’t immediately updated.
Solution: Logged the fetched user directly from supabase.auth.getUser().

3. Problem: Real-time updates sometimes failed
Cause: Subscription ran before userId was set.
Solution: Wrapped subscription inside if (userId) check. Added [userId] as dependency for the effect, so it runs only after userId is available.