import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading.jsx'
import useAuth from '../context/useAuth.js'
import { getApiErrorMessage, movieApi } from '../services/api.js'

function formatDate(value) {
  if (!value) return 'Date unavailable'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function money(value) {
  return Number(value || 0).toFixed(2)
}

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [bookingsError, setBookingsError] = useState('')
  const [loading, setLoading] = useState(true)


const requestBookings = useCallback(() => {
  const token = localStorage.getItem('tickbookToken')

  return movieApi.get('/booking/mine', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}, [])



  useEffect(() => {
    let active = true
    requestBookings()
      .then(({ data }) => {
        if (!active) return
        if (Array.isArray(data)) setBookings(data)
        else setBookingsError('The booking service returned an unexpected response.')
      })
      .catch((error) => {
        if (active) setBookingsError(getApiErrorMessage(error, 'Could not load your booking history.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [requestBookings])

  function refreshData() {
    setLoading(true)
    setBookingsError('')
    requestBookings()
      .then(({ data }) => {
        if (Array.isArray(data)) setBookings(data)
        else setBookingsError('The booking service returned an unexpected response.')
      })
      .catch((error) => setBookingsError(getApiErrorMessage(error, 'Could not load your booking history.')))
      .finally(() => setLoading(false))
  }

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <section className="profile-page">
      <header className="profile-heading">
        <div>
          <p className="eyebrow">YOUR TICKBOOK ACCOUNT</p>
          <h1>Profile</h1>
          <p>Manage your account details and revisit your movie bookings.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={handleLogout}>Log out</button>
      </header>

      {loading && <Loading label="Loading your profile…" />}
      {!loading && (
        <div className="profile-grid">
          <section className="profile-card personal-card">
            <div className="profile-card-heading">
              <div className="profile-avatar" aria-hidden="true">{(user?.name || user?.email || 'U').slice(0, 1).toUpperCase()}</div>
              <div>
                <p className="eyebrow">PERSONAL INFORMATION</p>
                <h2>{user?.name || 'TickBook member'}</h2>
              </div>
            </div>
            <dl className="profile-details">
              {user?.name && <div><dt>Full name</dt><dd>{user.name}</dd></div>}
              {user?.email && <div><dt>Email address</dt><dd>{user.email}</dd></div>}
              {(user?.userId ?? user?.id) != null && <div><dt>User ID</dt><dd>{user.userId ?? user.id}</dd></div>}
              {user?.role && <div><dt>Account role</dt><dd className="role-pill">{user.role}</dd></div>}
              {user?.status && <div><dt>Account status</dt><dd>{user.status}</dd></div>}
            </dl>
          </section>

          <section className="profile-card history-card">
            <div className="history-heading">
              <div>
                <p className="eyebrow">YOUR MOVIE NIGHTS</p>
                <h2>Booking history</h2>
              </div>
              <button className="text-button" type="button" onClick={refreshData} disabled={loading}>Refresh</button>
            </div>
            {bookingsError && <div className="notice notice-error" role="alert">{bookingsError}</div>}
            {!bookingsError && bookings.length === 0 && (
              <div className="history-empty">
                <span className="empty-icon" aria-hidden="true">◷</span>
                <p>No bookings yet. Pick a movie to plan your next outing.</p>
                <Link className="button button-primary" to="/#movies">Explore movies</Link>
              </div>
            )}
            {bookings.length > 0 && (
              <div className="booking-history-list">
                {bookings.map((booking) => (
                  <article className="history-booking" key={booking.bookingId}>
                    <div className="history-booking-title">
                      <div>
                        <h3>{booking.movieTitle || 'Movie booking'}</h3>
                        <p>{booking.theatreName || 'Theatre'}{booking.theatreLocation ? ` · ${booking.theatreLocation}` : ''}</p>
                      </div>
                      {booking.bookingStatus && <span className="status-badge">{booking.bookingStatus}</span>}
                    </div>
                    <div className="history-booking-meta">
                      <span>{booking.showDate || 'Date unavailable'}{booking.showTime ? ` · ${booking.showTime}` : ''}</span>
                      <span>Booked {formatDate(booking.bookingTime)}</span>
                    </div>
                    {booking.seatNumbers?.length > 0 && (
                      <p className="history-seats">Seats: {booking.seatNumbers.join(', ')}</p>
                    )}
                    {booking.totalAmount != null && (
                      <div className="history-total"><span>Total</span><strong>{money(booking.totalAmount)}</strong></div>
                    )}
                    <p className="history-id">Booking ID: {booking.bookingId}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  )
}
