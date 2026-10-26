import { useState } from 'react'
import { Link } from 'react-router-dom'

const moviePosters = {
  avengers: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
  'the avengers': 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
  'avengers endgame': 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
  'the avengers endgame': 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
  interstellar: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
}

function getMoviePoster(movie) {
  if (typeof movie.posterUrl === 'string' && movie.posterUrl.trim()) return movie.posterUrl
  const title = (movie.title || '').trim().toLocaleLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ')
  return moviePosters[title] || null
}

export default function MovieCard({ movie }) {
  const [imageSrc, setImageSrc] = useState(() => getMoviePoster(movie))

  function handleImageError() {
    const fallbackPoster = moviePosters[(movie.title || '').trim().toLocaleLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ')]
    setImageSrc((current) => current !== fallbackPoster ? fallbackPoster || null : null)
  }

  return (
    <article className="movie-card">
      <div className="movie-poster">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${movie.title || 'Movie'} poster`}
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="poster-placeholder" aria-label="Poster unavailable">
            <span className="poster-icon" aria-hidden="true">T</span>
            <span>Now showing</span>
          </div>
        )}
        {movie.duration != null && <span className="movie-duration">{movie.duration} min</span>}
      </div>
      <div className="movie-card-body">
        <p className="eyebrow">{movie.genre || 'Feature film'}</p>
        <h2>{movie.title || 'Untitled movie'}</h2>
        <p className="movie-language">{movie.language || 'Language not listed'}</p>
        <Link className="button button-primary movie-action" to={`/movie/${movie.id}`}>
          View shows <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}
