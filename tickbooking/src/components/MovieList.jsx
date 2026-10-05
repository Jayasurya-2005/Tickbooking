import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import './MovieList.css';
function MovieList() {
    const [search, setSearch] = useState("");
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        api.get("/movie")
            .then(response => {
                setMovies(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(search.toLowerCase()) ||
    movie.genre.toLowerCase().includes(search.toLowerCase()) ||
    movie.language.toLowerCase().includes(search.toLowerCase())
);

    return (
    <div>
        <h1>TickBook Movies</h1>
        <div className="search-box">

    <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
    />

</div>
        

        <div className="movie-container">

            {filteredMovies.map(movie => (

                <div className="movie-card" key={movie.id}>

                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                    />

                    <div className="movie-info">

                        <h2>{movie.title}</h2>

                        <p>{movie.genre}</p>

                        <p>{movie.language}</p>

                        <p>{movie.duration} minutes</p>

                        <Link to={`/movie/${movie.id}`}>
                            <button>
                                View Shows
                            </button>
                        </Link>

                    </div>

                </div>

            ))}

        </div>

    </div>
);
}

export default MovieList;