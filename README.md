# Replaylist

**Playlist in time.** Tracks your favorite playlists over time — capturing snapshots and visualizing how tracks move, rise, fall, and disappear.

## What it does

- **Track playlists** — Mark any Spotify playlist for tracking. Replaylist takes periodic snapshots automatically.
- **Snapshot history** — Browse point-in-time captures to see exactly what a playlist looked like on any given date.
- **Track movements** — See when tracks were added or removed and how their rankings shifted between snapshots.
- **Search & discover** — Find playlists to track from Spotify's catalog. Note: Spotify-owned playlists (editorial charts, etc.) are not supported by the API and cannot be searched or tracked.
- **Featured playlists** — Explore curated playlists from popular music charts.
- **Multi-auth** — Sign in with Spotify or Google.

## Stack

| Layer         | Technology                                                   |
| ------------- | ------------------------------------------------------------ |
| Frontend      | Next.js 15 (App Router), React 19, TypeScript, TailwindCSS 4 |
| State         | React Query                                                  |
| UI            | Shadcn, Radix UI, Framer Motion, Lucide React                |
| Backend       | Express 5, TypeScript                                        |
| Database      | PostgreSQL 15 + Prisma ORM                                   |
| Cache / Queue | Redis 7                                                      |
| Auth          | Spotify OAuth, Google OAuth                                  |
| Jobs          | Node-cron                                                    |
| Infra         | Docker, GitHub Actions → Hetzner VPS                         |

## Setup

### Docker (recommended)

**Prerequisites:** Docker, a [Spotify app](https://developer.spotify.com/dashboard), and optionally Google OAuth credentials.

**`.env`** (root — used by Docker Compose to configure the `db` service)

```env
DATABASE_URL=postgres://user:password@db:5432/replaylist
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=replaylist
DB_PORT=5432
REDIS_URL=redis://redis:6379
REDIS_PORT=6379
```

**`server/.env`**

```env
PORT=4001
BASE_URL=http://127.0.0.1:3000
DATABASE_URL=postgres://user:password@db:5432/replaylist
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=replaylist
DB_PORT=5432
REDIS_URL=redis://redis:6379
REDIS_PORT=6379
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=http://127.0.0.1:4001/api/auth/spotify/callback
SPOTIFY_AUTH_URI=https://accounts.spotify.com/authorize
SPOTIFY_URL=https://api.spotify.com/v1
TOKEN_API=https://accounts.spotify.com/api/token
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://127.0.0.1:4001/api/auth/google/callback
JWT_SECRET=
SYS_ADMIN_EMAIL=
NODE_ENV=DEVELOPMENT
```

**`client/.env.local`**

```env
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000
BASE_URL=http://127.0.0.1:3000
API_URL=http://server:4001
NEXT_PUBLIC_API_URL=http://server:4001
NEXT_PUBLIC_SPOTIFY_URL=https://open.spotify.com
NEXT_PUBLIC_USER_URL=https://open.spotify.com/user
NEXT_PUBLIC_SYS_ADMIN_EMAIL=
```

```bash
git clone https://github.com/your-username/replaylist.git
cd replaylist
docker-compose up -d --build
```

Frontend → http://localhost:3000 · API → http://localhost:4001

### Local (no Docker)

**Prerequisites:** Node.js 20+, PostgreSQL 15, Redis 7, a [Spotify app](https://developer.spotify.com/dashboard).

Update `DATABASE_URL` in `server/.env` to point to your local Postgres instance (e.g. `postgres://user:password@localhost:5432/replaylist`) and `REDIS_URL` to `redis://localhost:6379`. In `client/.env.local`, change `API_URL` and `NEXT_PUBLIC_API_URL` to `http://localhost:4001`.

```bash
# Terminal 1 — backend
cd server
npm install
npx prisma migrate dev
npm run prisma:generate
npm run dev

# Terminal 2 — frontend
cd client
npm install
npm run dev
```

Frontend → http://localhost:3000 · API → http://localhost:4001

## License

MIT
