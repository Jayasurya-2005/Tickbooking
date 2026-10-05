import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./BookingConfirmation.css";
import { QRCodeSVG } from "qrcode.react";
function BookingConfirmation() {

    const location = useLocation();
    const navigate = useNavigate();

    const booking = location.state?.booking;
    const seats = location.state?.seats || [];

    const [show, setShow] = useState(null);

    useEffect(() => {

        if (booking?.showId) {

            api.get(`/show/${booking.showId}`)
                .then(response => {
                    console.log("Show details:", response.data);
                    setShow(response.data);
                })
                .catch(error => {
                    console.log("Show fetch error:", error);
                });
        }

    }, [booking]);

    if (!booking) {
        return (
            <div>
                <h2>Booking details not found</h2>

                <button onClick={() => navigate("/")}>
                    Go to Movies
                </button>
            </div>
        );
    }

    return (
    <div className="confirmation-page">

        <h1>🎉 Booking Confirmed</h1>

        <div className="ticket">

            <div className="ticket-header">
                <h2>🎬 TickBook</h2>
                <p>Your Movie Ticket</p>
            </div>

            <div className="ticket-body">

                {show && (
                    <>
                        <h2 className="movie-title">
                            {show.movie.title}
                        </h2>

                        <div className="show-info">

                            <p>
                                <strong>Theatre:</strong>{" "}
                                {show.theatre.name}
                            </p>

                            <p>
                                <strong>Location:</strong>{" "}
                                {show.theatre.location}
                            </p>

                            <p>
                                <strong>Date:</strong>{" "}
                                {show.showDate}
                            </p>

                            <p>
                                <strong>Time:</strong>{" "}
                                {show.showTime}
                            </p>

                        </div>
                    </>
                )}

                <div className="seat-section">

                    <h3>Selected Seats</h3>

                    <div className="seats">
                        {seats.map(seat => (
                            <span
                                className="seat"
                                key={seat.seatId}
                            >
                                {seat.seatNumber}
                            </span>
                        ))}
                    </div>

                </div>

                <div className="price-section">

                    <div className="price-row">
                        <span>Subtotal</span>
                        <span>
                            ₹{booking.subtotal.toFixed(2)}
                        </span>
                    </div>

                    <div className="price-row">
                        <span>GST (18%)</span>
                        <span>
                            ₹{booking.gst.toFixed(2)}
                        </span>
                    </div>

                    <div className="total-row">
                        <span>Total</span>
                        <span>
                            ₹{booking.totalAmount.toFixed(2)}
                        </span>
                    </div>

                </div>

                <p className="status">
                    ✓ {booking.bookingStatus}
                </p>

                <p>
                    <strong>Booking ID:</strong>{" "}
                    {booking.bookingId}
                </p>
                <div className="qr-section">

    <QRCodeSVG
        value={`TICKBOOK-${booking.bookingId}`}
        size={160}
    />

    <p>Scan to verify ticket</p>

</div>

            </div>

        </div>

        <button
            className="back-button"
            onClick={() => navigate("/")}
        >
            Back to Movies
        </button>

    </div>
);
}

export default BookingConfirmation;