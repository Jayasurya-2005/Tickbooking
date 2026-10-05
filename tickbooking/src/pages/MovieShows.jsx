import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import './movieshow.css'
function MovieShows() {

    const { movieId } = useParams();
     const [shows, setShows] = useState([]);
      useEffect(() => {

        api.get(`/show/movie/${movieId}`)
            .then(response => {
                setShows(response.data);
            })
            .catch(error => {
                console.log(error);
            });

    }, [movieId]);
   return (
    <div className="shows-page">

        <h1>Available Shows</h1>

        <div className="show-container">

            {shows.length === 0 ? (

                <p>No shows available for this movie.</p>

            ) : (

                shows.map(show => (

                    <div
                        className="show-card"
                        key={show.id}
                    >

                        <div className="show-details">

                            <h2>
                                {show.theatre.name}
                            </h2>

                            <p>
                                📍 {show.theatre.location}
                            </p>

                            <p>
                                📅 {show.showDate}
                            </p>

                            <p className="show-time">
                                🕐 {show.showTime}
                            </p>

                            <p className="show-price">
                                ₹{show.ticketPrice}
                            </p>

                        </div>

                        <Link
                            to={`/show/${show.id}/seats`}
                        >
                            <button className="select-show-button">
                                Select Seats
                            </button>
                        </Link>

                    </div>

                ))
            )}

        </div>

    </div>
);
}

export default MovieShows;