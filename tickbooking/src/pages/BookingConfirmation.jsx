import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Loading from '../components/Loading.jsx'
import { getApiErrorMessage, movieApi } from '../services/api.js'

const money = (amount) => Number(amount || 0).toFixed(2)

export default function BookingConfirmation() {
  const location = useLocation()
  const booking = location.state?.booking
  const seats = location.state?.seats || []
  const [show, setShow] = useState(null)
  const [showError, setShowError] = useState('')
  const needsShowDetails = Boolean(booking?.showId && (
    !booking.movieTitle || !booking.theatreName
    || !booking.theatreLocation || !booking.showDate || !booking.showTime
  ))
  const [showLookupComplete, setShowLookupComplete] = useState(!needsShowDetails)

  useEffect(() => {
    if (!needsShowDetails) return undefined

    let active = true
    movieApi.get(`/show/${booking.showId}`)
      .then(({ data }) => {
        if (active) setShow(data)
      })
      .catch((error) => {
        if (active) setShowError(getApiErrorMessage(error, 'Some show details could not be loaded.'))
      })
      .finally(() => {
        if (active) setShowLookupComplete(true)
      })

    return () => {
      active = false
    }
  }, [booking, needsShowDetails])

  if (!booking) {
    return (
      <section className="empty-state confirmation-missing">
        <span className="empty-icon" aria-hidden="true">◷</span>
        <h1>No booking to display</h1>
        <p>Booking details are only available immediately after a confirmed booking.</p>
        <Link className="button button-primary" to="/">Back to movies</Link>
      </section>
    )
  }

  if (needsShowDetails && !showLookupComplete) return <Loading label="Preparing your ticket…" />

  const movieTitle = booking.movieTitle || show?.movie?.title
  const theatreName = booking.theatreName || show?.theatre?.name
  const theatreLocation = booking.theatreLocation || show?.theatre?.location
  const showDate = booking.showDate || show?.showDate
  const showTime = booking.showTime || show?.showTime
  const selectedSeatNames = seats.map((seat) => seat.seatNumber).filter(Boolean)

  return (
    <section className="confirmation-page">
      <div className="confirmation-heading">
        <span className="confirmation-check" aria-hidden="true">✓</span>
        <p className="eyebrow">BOOKING CONFIRMED</p>
        <h1>You’re going to the movies.</h1>
        <p>Your booking has been confirmed by TickBook.</p>
      </div>
      {showError && <p className="notice notice-info" role="status">{showError}</p>}
      <article className="ticket">
        <div className="ticket-main">
          <div className="ticket-topline">
            <span className="ticket-brand">TICK<span>BOOK</span></span>
            {booking.bookingStatus && <span className="status-badge">{booking.bookingStatus}</span>}
          </div>
          <h2>{movieTitle || 'Movie ticket'}</h2>
          {(theatreName || theatreLocation) && (
            <div className="ticket-venue">
              {theatreName && <strong>{theatreName}</strong>}
              {theatreLocation && <span>{theatreLocation}</span>}
            </div>
          )}
          <div className="ticket-details">
            {showDate && <div><span>DATE</span><strong>{showDate}</strong></div>}
            {showTime && <div><span>TIME</span><strong>{showTime}</strong></div>}
            {selectedSeatNames.length > 0 && <div><span>SEATS</span><strong>{selectedSeatNames.join(', ')}</strong></div>}
          </div>
          <div className="ticket-id">
            <span>BOOKING ID</span>
            <strong>{booking.bookingId ?? '—'}</strong>
          </div>
        </div>
        <div className="ticket-stub">
          <div className="ticket-perforation" />
          <p className="eyebrow">PRICE SUMMARY</p>
          {booking.subtotal != null && <div className="summary-line"><span>Subtotal</span><strong>{money(booking.subtotal)}</strong></div>}
          {booking.gst != null && <div className="summary-line"><span>GST</span><strong>{money(booking.gst)}</strong></div>}
          {booking.totalAmount != null && <div className="summary-line summary-total"><span>Total</span><strong>{money(booking.totalAmount)}</strong></div>}
          <p className="ticket-note">This confirms your booking. No payment was processed by TickBook.</p>
        </div>
      </article>
      <Link className="button button-primary confirmation-home" to="/">Back to movies</Link>
    </section>
  )
}
