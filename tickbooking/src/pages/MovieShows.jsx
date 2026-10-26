import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loading from '../components/Loading.jsx'
import { getApiErrorMessage, movieApi } from '../services/api.js'

function formatDate(value) {
  if (!value) return 'Date to be announced'
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function formatTime(value) {
  if (!value) return 'Time to be announced'
  const match = /^(\d{1,2}):(\d{2})/.exec(value)
  if (!match) return value
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
    .format(new Date(2000, 0, 1, Number(match[1]), Number(match[2])))
}

export default function MovieShows() {
  const { movieId } = useParams()
  const [movie, setMovie] = useState(null)
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([
      movieApi.get(`/movie/${movieId}`),
      movieApi.get(`/show/movie/${movieId}`),
    ])
      .then(([movieResponse, showsResponse]) => {
        if (!Array.isArray(showsResponse.data)) throw new Error('The show service returned an unexpected response.')
        if (active) {
          setMovie(movieResponse.data)
          setShows(showsResponse.data)
        }
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError, 'We couldn’t load this movie’s showtimes. Please try again.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [movieId])

  return (
    <section className="content-page">
      <Link className="back-link" to="/">← <span>All movies</span></Link>
      {loading && <Loading label="Loading showtimes…" />}
      {!loading && error && <div className="notice notice-error" role="alert">{error}</div>}
      {!loading && !error && (
        <>
          <div className="page-title-block">
            <p className="eyebrow">PICK YOUR EXPERIENCE</p>
            <h1>{movie?.title || 'Movie showtimes'}</h1>
            <p>{[movie?.genre, movie?.language, movie?.duration && `${movie.duration} min`].filter(Boolean).join(' · ')}</p>
          </div>
          <div className="show-list">
            {shows.length === 0 ? (
              <div className="empty-state compact">
                <span className="empty-icon" aria-hidden="true">◷</span>
                <h3>No shows available</h3>
                <p>There are no scheduled showtimes for this movie right now.</p>
              </div>
            ) : shows.map((show) => (
              <article className="show-card" key={show.id}>
                <div className="show-theatre">
                  <span className="theatre-icon" aria-hidden="true">⌂</span>
                  <div>
                    <h2>{show.theatre?.name || 'Theatre'}</h2>
                    <p>{show.theatre?.location || 'Location not listed'}</p>
                  </div>
                </div>
                <div className="show-details">
                  <div><span className="detail-label">DATE</span><strong>{formatDate(show.showDate)}</strong></div>
                  <div><span className="detail-label">TIME</span><strong>{formatTime(show.showTime)}</strong></div>
                  <div><span className="detail-label">FROM</span><strong>{Number(show.ticketPrice).toFixed(2)}</strong></div>
                </div>
                <Link className="button button-primary" to={`/show/${show.id}/seats`}>Select seats <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
