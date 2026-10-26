# TickBook

TickBook is a React and Vite frontend for browsing movies, viewing showtimes, selecting seats, and booking through the existing TickBook services.

## Run locally

Start the movie booking service on `http://localhost:8080` and the user service on `http://localhost:8081`, then run:

```sh
npm install
npm run dev
```

Vite serves the frontend at `http://localhost:5173`. Both Spring Boot services must allow cross-origin requests from that origin. If the browser reports a CORS error, configure CORS in the backend; the frontend does not proxy or bypass it.

To use deployed API servers, copy `.env.example` to `.env.local`, set `VITE_MOVIE_API_URL` and `VITE_USER_API_URL` to the respective API base URLs, then restart Vite. These are backend API URLs, not database URLs.

## Available commands

- `npm run dev` — start the local development server
- `npm run build` — create a production build in `dist`
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## API integration

The Axios clients and default base URLs are defined in `src/services/api.js`; Vite environment variables can override them.

- Movie booking service (`:8080`): movies, shows, seats, and bookings
- User service (`:8081`): registration and login

Registration and booking data are persisted by the Spring Boot services in their configured MySQL databases. The frontend never connects directly to MySQL. Run both backends and configure their datasource credentials and CORS before using registration or booking.

Booking requests send only the show ID and selected seat IDs. The backend remains authoritative for seat availability and final pricing; the seat page's GST-inclusive amount is only an estimate. No payment is collected or processed by TickBook.

## Authentication and profile

The user service exposes registration, login, and the authenticated `GET /user/profile` endpoint. The movie service accepts authenticated bookings and exposes `GET /booking/mine` for bookings associated with the authenticated account. Guest booking remains available, but guest bookings cannot be included in a user's history.

Both Spring Boot services must be configured with the same `TICKBOOK_JWT_SECRET` environment variable. Use a randomly generated value of at least 32 bytes, keep it outside source control, and restart both services after setting it. The user service signs tokens with this key; the movie service verifies them before associating a booking with an account. The user service must also be restarted to apply its new profile route and JWT validation.

The cinema database adds a nullable `user_id` column to bookings through the existing `spring.jpa.hibernate.ddl-auto=update` setting. Existing bookings are not attributed retroactively; only bookings made with a valid login token are associated with a user.
