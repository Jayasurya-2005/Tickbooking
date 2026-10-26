# TickBook Backend Requirements

## Already Existing APIs (No Changes Needed)

### User Service (Port 8081)
- `POST /user/register` - Register new user ✓
- `POST /user/login` - Login and get JWT token ✓

### Cinema Service (Port 8080)
- `GET /movie` - Get all movies ✓
- `GET /movie/{id}` - Get single movie ✓
- `GET /show/movie/{movieId}` - Get shows for movie ✓
- `GET /seat/show/{showId}` - Get seats for show (with booking status) ✓
- `POST /booking` - Create booking ✓

---

## Missing Backend APIs to Add

### 1. User Profile Endpoint
**File:** `cinima/src/main/java/.../controller/UserController.java`
**Method:** `GET /user/me`
**Purpose:** Get current authenticated user details
**Request:** None (uses JWT from header)
**Response:**
```json
{
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

**Implementation needed:**
- Add JWT authentication filter to cinima service
- Create endpoint that extracts user from JWT token

---

### 2. User's Bookings Endpoint
**File:** Add new controller or extend BookingController
**Method:** `GET /booking/my`
**Purpose:** Get all bookings for current user
**Request:** Auth header with JWT
**Response:**
```json
[
  {
    "bookingId": 1,
    "movieTitle": "The Social Reckoning",
    "theatreName": "PVR Cinemas",
    "theatreLocation": "Bengaluru",
    "showDate": "2026-10-08",
    "showTime": "19:30:00",
    "seats": "A5, A6",
    "totalAmount": 472.00,
    "bookingStatus": "CONFIRMED",
    "paymentStatus": "SUCCESS",
    "bookingTime": "2026-10-08T19:25:00"
  }
]
```

**Database changes needed:**
- Add `userId` field to Booking entity
- Update BookingRepository with findByUserId method
- Update createBooking to accept and store userId

---

### 3. Razorpay Payment Module (NEW)
**Location:** Create new module `cinima/src/main/java/.../payment/`

#### Files to create:

**Payment Entity** (`Payment.java`):
```java
@Entity
@Table(name = "payments")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
    
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    
    private Double amount;
    private String currency;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus status; // CREATED, PENDING, SUCCESS, FAILED
    
    private LocalDateTime createdAt;
    private LocalDateTime verifiedAt;
}
```

**PaymentStatus Enum** (`PaymentStatus.java`):
```java
public enum PaymentStatus {
    CREATED, PENDING, SUCCESS, FAILED
}
```

**PaymentRepository.java**:
```java
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBookingId(Long bookingId);
    Optional<Payment> findByRazorpayOrderId(String orderId);
}
```

**PaymentController.java** (`/payment`):
- `POST /payment/create-order` - Create Razorpay order
  - Request: `{ "bookingId": 1, "amount": 472.00, "currency": "INR" }`
  - Response: `{ "orderId": "order_123...", "amount": 47200, "currency": "INR" }`
  
- `POST /payment/verify` - Verify payment signature
  - Request: `{ "bookingId": 1, "orderId": "order_123...", "paymentId": "pay_123...", "signature": "sig_123..." }`
  - Response: `{ "success": true, "paymentId": 1 }`

**PaymentService.java**:
- Create Razorpay order using Razorpay SDK
- Verify payment signature
- Update booking status to CONFIRMED
- Update payment status

**RazorpayService.java**:
- Initialize Razorpay client with API keys
- Create order API call
- Verify signature using HMAC SHA256

**DTOs:**
- `CreatePaymentOrderRequest.java`
- `CreatePaymentOrderResponse.java`
- `VerifyPaymentRequest.java`
- `VerifyPaymentResponse.java`

**application.properties additions:**
```properties
razorpay.key.id=YOUR_KEY_ID
razorpay.key.secret=YOUR_KEY_SECRET
```

---

### 4. Favorites/Wishlist System (Optional)
**Location:** Extend MovieController or create new controller

**Favorite Entity** (`Favorite.java`):
```java
@Entity
@Table(name = "favorites", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userId", "movieId"})
})
public class Favorite {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;
    
    private LocalDateTime createdAt;
}
```

**Endpoints:**
- `POST /movie/{movieId}/favorite` - Add to favorites
- `DELETE /movie/{movieId}/favorite` - Remove from favorites
- `GET /user/favorites` - Get user's favorites list

---

## Priority Order for Backend Changes

### Phase 1 (Required for payment flow):
1. **Add JWT auth filter to cinima service** - Required for protected endpoints
2. **Create Payment module** - Required for Razorpay integration
3. **Add userId to Booking entity** - Required for user's bookings

### Phase 2 (Required for user features):
4. **GET /user/me endpoint** - Required for profile display
5. **GET /booking/my endpoint** - Required for My Bookings page

### Phase 3 (Nice to have):
6. **Favorites system** - For wishlist feature
7. **Admin user management endpoints** - For admin dashboard

---

## Frontend Configuration Needed

### Environment Variables (.env)
Create `.env` file in tickbooking root:
```
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_API_BASE_URL=http://localhost:8080
VITE_USER_SERVICE_URL=http://localhost:8081
```

### Update api.js
Update `tickbooking/src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tickbook_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Summary

### Already Working (Full Flow):
- User registration ✓
- User login ✓
- Browse movies ✓
- View movie details ✓
- View shows for movie ✓
- View seats for show ✓
- Select seats ✓
- Create booking ✓

### Needs Backend Work:
- JWT authentication on cinima service (for protected endpoints)
- Payment module with Razorpay (CRITICAL for payment flow)
- User's bookings endpoint (for My Bookings page)
- User profile endpoint

### Can Work Without Backend (Frontend Only):
- Favorites (can be frontend-only with localStorage for demo)
- Admin dashboard (can show mock data)
- Profile page (can show user from AuthContext)
