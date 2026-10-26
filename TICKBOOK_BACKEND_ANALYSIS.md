# TickBook Backend Analysis — API Mapping

## Existing Backend Architecture

### Service 1: user-service (Port 8081)
**Database:** `tickbook_user` (MySQL)

#### Entities:
- **User** — id, name, email (unique), password (BCrypt), role (USER/ADMIN)

#### Repositories:
- `UserRepository` — findByEmail()

#### Services:
- `JwtService` — generateToken(userId, email, role) → JWT (1hr expiry)
- `UserService` — registerUser(), loginUser()

#### Controllers:
- **UserController** `@RequestMapping("/user")`
  - `POST /user/register` — Register new user
  - `POST /user/login` — Login, returns LoginResponse (userId, name, email, role, token)

#### DTOs:
- `LoginRequest` — { email, password }
- `LoginResponse` — { userId, name, email, role, token }

#### Security:
- CSRF disabled
- /user/register, /user/login → permitAll
- All other endpoints → authenticated
- BCrypt password encoder

---

### Service 2: cinima (Port 8080 assumed)
**Database:** `cinima` (MySQL)

#### Entities:
- **Movie** — id, title, genre, language, duration (min), posterUrl
- **Theatre** — id, name, location
- **Show** — id, movie (ManyToOne), theatre (ManyToOne), showDate, showTime, ticketPrice, availableSeats
- **Seat** — id, seatNumber, rowName, theatre (ManyToOne)
- **Booking** — id, show (ManyToOne), subtotal, gst, totalAmount, bookingTime, bookingStatus
- **BookingSeat** — id, booking (ManyToOne), seat (ManyToOne), show (ManyToOne) [unique: show_id+seat_id]

#### Repositories:
- `MovieRepository` — Standard JPA
- `TheatreRepository` — Standard JPA
- `ShowRepository` — findByMovieId(movieId)
- `SeatRepository` — Standard JPA
- `BookingSeatRepository` — findBookedSeat(seatId, showId)

#### Services:
- `MovieService` — CRUD
- `Theatreservice` — CRUD
- `ShowService` — CRUD, getShowsByMovieId()
- `SeatService` — CRUD, generateSeatsForTheatre(), getSeatsForShow() **with booking status + premium pricing**
- `BookingService` — createBooking() **with seat conflict check + price calculation + CONFIRMED status**

#### Controllers:

**MovieController** `@RequestMapping("/movie")`
- `POST /movie` — addMovie
- `GET /movie` — getAllMovies
- `GET /movie/{id}` — getMovie
- `PUT /movie/{id}` — updateMovie
- `DELETE /movie/{id}` — deleteMovie

**TheatreController** `@RequestMapping("/theatre")`
- `POST /theatre` — addMovie (typo in method name)
- `GET /theatre` — getAllTheatre
- `GET /theatre/{id}` — getTheatreById
- `DELETE /theatre/{id}` — deleteTheatre
- `PUT /theatre/{id}` — updateTheatre

**ShowController** `@RequestMapping("/show")`
- `POST /show` — addShow
- `GET /show` — getAllShow
- `GET /show/{id}` — getById
- `PUT /show/{id}` — updateShow
- `DELETE /show/{id}` — deleteShow
- `GET /show/movie/{movieId}` — getShowsByMovieId

**SeatController** `@RequestMapping("/seat")`
- `POST /seat` — addSeat
- `POST /seat/generate/{theatreId}` — generateSeatsForTheatre (A-H, 1-10)
- `GET /seat` — getAllSeats
- `GET /seat/show/{showId}` — getSeatsForShow **returns SeatResponse with status + price**

**BookingController** `@RequestMapping("/booking")`
- `POST /booking` — createBooking (requires showId, seatIds)

#### DTOs:
- `BookingRequest` — { showId, seatIds[] }
- `BookingResponse` — { bookingId, showId, movieTitle, theatreName, theatreLocation, showDate, showTime, subtotal, gst, totalAmount, bookingStatus }
- `SeatResponse` — { seatId, seatNumber, rowName, status (AVAILABLE/BOOKED), price }

#### Premium Pricing Logic (Backend):
- Rows A-D → Premium (1.25x price)
- Rows E-H → Normal (base price)
- GST: 18%

#### Seat Conflict Handling:
- `SeatAlreadyBookedException` → HTTP 409 Conflict
- Checked in both SeatService (for display) and BookingService (for booking)

---

## FRONTEND → BACKEND API MAPPING

### Public APIs (No Auth Required)

| Frontend Action | API Call | Backend Endpoint |
|--------|-----------|---------------|
| Browse all movies | GET | /movie |
| Get single movie | GET | /movie/{id} |
| Search/filter movies | GET /movie + client-side filter | /movie |
| Get shows for movie | GET | /show/movie/{movieId} |
| Get seats for show | GET | /seat/show/{showId} |

### Protected APIs (Auth Required)

| Frontend Action | API Call | Backend Endpoint |
|--------|-----------|---------------|
| Create booking | POST | /booking |
| Get user profile | GET | /user/me (MISSING — needs to be added) |
| Get user bookings | GET | /booking/my (MISSING — needs to be added) |
| Add to favorites | POST | /movie/{id}/favorite (MISSING — needs to be added) |
| Remove from favorites | DELETE | /movie/{id}/favorite (MISSING — needs to be added) |
| Get favorites list | GET | /user/favorites (MISSING — needs to be added) |
| Update profile | PUT | /user/me (MISSING — needs to be added) |
| Admin: CRUD movies | POST/PUT/DELETE | /movie |
| Admin: CRUD theatres | POST/PUT/DELETE | /theatre |
| Admin: CRUD shows | POST/PUT/DELETE | /show |
| Admin: CRUD seats | POST/PUT/DELETE | /seat |
| Admin: CRUD users | (MISSING — needs to be added) |
| Admin: View all bookings | (MISSING — needs to be added) |
| Payment: Create Razorpay order | POST | /payment/create-order (MISSING — needs to be added) |
| Payment: Verify payment | POST | /payment/verify (MISSING — needs to be added) |

---

## MISSING BACKEND FEATURES (Need to be Added)

### 1. User Profile Endpoint
- `GET /user/me` — Returns current authenticated user info
- Requires JWT authentication filter

### 2. User Bookings Endpoint
- `GET /booking/my` — Returns all bookings for current user
- Requires linking Booking to User entity

### 3. Favorite/Wishlist System
- New entity: **Favorite** — id, user (ManyToOne), movie (ManyToOne)
- New repository: `FavoriteRepository`
- New endpoints:
  - `POST /movie/{id}/favorite` — Add to favorites
  - `DELETE /movie/{id}/favorite` — Remove from favorites
  - `GET /user/favorites` — Get user's favorites

### 4. Booking → User Relationship
- Add `userId` field to Booking entity
- Update createBooking to accept userId
- Add `GET /booking/my` endpoint

### 5. Razorpay Payment Module (NEW)
- New module: `payment/`
  - `PaymentController` — `/payment/create-order`, `/payment/verify`
  - `PaymentService` — order creation, verification
  - `RazorpayService` — Razorpay SDK integration
  - `Payment` entity — id, bookingId, razorpayOrderId, razorpayPaymentId, amount, currency, status
  - DTOs: `CreatePaymentOrderRequest`, `CreatePaymentOrderResponse`, `VerifyPaymentRequest`

### 6. JWT Authentication Filter
- `JwtAuthenticationFilter` — Intercepts requests, validates JWT, sets SecurityContext
- Must be added to SecurityConfig for cinima service

### 7. Admin Endpoints
- Admin-only endpoints for managing users, bookings, payments
- Role-based access control

### 8. Date-based Show Filtering
- `GET /show/movie/{movieId}/dates` — Get unique show dates for a movie
- `GET /show/movie/{movieId}/date/{date}` — Get shows for a specific date

---

## FRONTEND CHANGES REQUIRED

### New Files Needed:

**Context:**
- `AuthContext.jsx` — JWT auth state management
- `BookingContext.jsx` — Booking state (optional)

**Services:**
- `auth.js` — Auth API calls (login, register, getProfile, etc.)

**Components:**
- `MovieCard.jsx` — Reusable movie card component
- `TrailerModal.jsx` — Cinematic video modal
- `DateSelector.jsx` — Horizontal date picker
- `Toast.jsx` — Notification system
- `Loading.jsx` — Loading states

**Pages:**
- `Home.jsx` — Premium cinematic home page
- `Movies.jsx` — Movie discovery with search/filters
- `MovieDetails.jsx` — Full movie details page
- `Login.jsx` — Login page
- `Signup.jsx` — Registration page
- `Profile.jsx` — User profile page
- `Favorites.jsx` — Favorites list
- `BookingSummary.jsx` — Pre-payment summary
- `Payment.jsx` — Razorpay checkout
- `AdminDashboard.jsx` — Admin overview
- `AdminMovies.jsx` — Admin movie management
- `AdminTheatres.jsx` — Admin theatre management
- `AdminShows.jsx` — Admin show management
- `AdminUsers.jsx` — Admin user management
- `AdminBookings.jsx` — Admin booking management
- `AdminPayments.jsx` — Admin payment management

**Routing Updates:**
- Add auth routes
- Add admin routes
- Add protected route wrapper

---

## DESIGN SYSTEM

### Color Palette (TickBook Premium Cinematic):
```css
:root {
  --bg-primary: #080b14;
  --bg-secondary: #101522;
  --bg-tertiary: #1a1f2e;
  --glass: rgba(255, 255, 255, 0.06);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-hover: rgba(255, 255, 255, 0.1);
  --primary: #8b5cf6;
  --primary-light: #a78bfa;
  --secondary: #06b6d4;
  --accent: #f472b6;
  --text: #ffffff;
  --text-muted: #9ca3af;
  --text-dim: #6b7280;
  --success: #10b981;
  --error: #ef4444;
  --warning: #f59e0b;
  --seat-available: rgba(255, 255, 255, 0.2);
  --seat-selected: #8b5cf6;
  --seat-booked: rgba(239, 68, 68, 0.3);
  --glass-blur: blur(20px);
}
```

### Typography:
- Primary: "Plus Jakarta Sans" (already included)
- Headings: 700-800 weight
- Body: 400-500 weight

---

## PHASED IMPLEMENTATION PLAN

### Phase 1: Design System + Layout (Current)
- Create CSS variables, glassmorphism classes
- Build new glassmorphic Navbar
- Set up routing structure

### Phase 2: Auth System
- AuthContext + ProtectedRoute
- Login/Signup pages
- JWT token management

### Phase 3: Movie Discovery
- Home page (cinematic hero)
- Movies page with search/filters
- MovieCard component
- MovieDetails page

### Phase 4: Booking Flow
- Theatre/Show selection
- Date selector
- Dynamic seat selection
- Booking summary

### Phase 5: Payment
- Razorpay backend integration
- Payment page
- Verification flow

### Phase 6: User Features
- My Bookings
- Profile
- Favorites

### Phase 7: Admin Dashboard
- Admin routes
- CRUD panels

### Phase 8: Polish
- Responsive design
- Animations
- Error handling
- Loading states
