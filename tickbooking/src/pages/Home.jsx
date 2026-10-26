import { useEffect, useMemo, useState } from 'react'
import MovieCard from '../components/MovieCard.jsx'
import Loading from '../components/Loading.jsx'
import { getApiErrorMessage, movieApi } from '../services/api.js'

export default function Home() {
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    movieApi.get('/movie')
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error('The movie service returned an unexpected response.')
        if (active) setMovies(data)
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError, 'We couldn’t load movies. Please try again later.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const filteredMovies = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    if (!query) return movies
    return movies.filter((movie) => (movie.title || '').toLocaleLowerCase().includes(query))
  }, [movies, search])

  return (
    <div className="home-page">
      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="eyebrow-dot" /> THE BIG SCREEN IS CALLING</p>
          <h1>Find your next<br /><span>movie moment.</span></h1>
          <p className="hero-description">Discover what’s playing and book your seats for a night worth remembering.</p>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="orbit-center">T</span>
        </div>
      </section>

      <section className="movies-section" id="movies">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CURATED FOR YOU</p>
            <h2>Now showing</h2>
          </div>
          <label className="search-box">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search movies"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search movies by title"
            />
          </label>
        </div>

        {loading && <Loading label="Finding movies…" />}
        {!loading && error && (
          <div className="notice notice-error" role="alert">
            <span>{error}</span>
            <button className="text-button" type="button" onClick={() => window.location.reload()}>Try again</button>
          </div>
        )}
        {!loading && !error && filteredMovies.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">✦</span>
            <h3>{movies.length ? 'No movies match that search' : 'No movies available yet'}</h3>
            <p>{movies.length ? 'Try another title.' : 'Check back soon for the latest movies and showtimes.'}</p>
          </div>
        )}
        {!loading && !error && filteredMovies.length > 0 && (
          <div className="movie-grid">
            {filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        )}
      </section>
    </div>
  )
}
