import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SeatSelection.css";

function SeatSelection() {

    const { showId } = useParams();
    const navigate = useNavigate();

    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const selectedSeatDetails = seats.filter(seat =>
        selectedSeats.includes(seat.seatId)
    );

    const subtotal = selectedSeatDetails.reduce(
        (total, seat) => total + seat.price,
        0
    );

    const gst = subtotal * 0.18;
    const totalAmount = subtotal + gst;

    useEffect(() => {

        api.get(`/seat/show/${showId}`)
            .then(response => {
                setSeats(response.data);
            })
            .catch(error => {
                console.log(error);
            });

    }, [showId]);

    const selectSeat = (seat) => {

        if (seat.status === "BOOKED") {
            return;
        }

        if (selectedSeats.includes(seat.seatId)) {

            setSelectedSeats(
                selectedSeats.filter(
                    id => id !== seat.seatId
                )
            );

        } else {

            setSelectedSeats([
                ...selectedSeats,
                seat.seatId
            ]);

        }
    };

    const proceedToBooking = () => {

        const bookingData = {
            showId: Number(showId),
            seatIds: selectedSeats
        };

        api.post("/booking", bookingData)
            .then(response => {

                console.log(
                    "Booking successful:",
                    response.data
                );

                navigate("/booking-confirmation", {
                    state: {
                        booking: response.data,
                        seats: selectedSeatDetails
                    }
                });

            })
            .catch(error => {

                console.log("Booking failed:", error);

                if (error.response) {
                    alert(error.response.data);
                } else {
                    alert("Something went wrong");
                }

            });
    };

    return (
        <div className="seat-page">

            <h1>Select Your Seats</h1>

            <div className="screen">
                SCREEN
            </div>

            <div className="seat-layout">

                {["A", "B", "C", "D", "E", "F", "G", "H"].map(row => (

                    <div className="seat-row" key={row}>

                        <span className="row-label">
                            {row}
                        </span>

                        {seats
                            .filter(seat =>
                                seat.rowName === row
                            )
                            .map(seat => {

                                const isSelected =
                                    selectedSeats.includes(
                                        seat.seatId
                                    );

                                const isBooked =
                                    seat.status === "BOOKED";

                                const isPremium =
                                    ["A", "B", "C", "D"]
                                        .includes(row);

                                return (
                                    <button
                                        key={seat.seatId}
                                        className={`
                                            seat
                                            ${isSelected ? "selected" : ""}
                                            ${isBooked ? "booked" : ""}
                                            ${isPremium ? "premium" : ""}
                                        `}
                                        disabled={isBooked}
                                        onClick={() =>
                                            selectSeat(seat)
                                        }
                                    >
                                        {seat.seatNumber}
                                    </button>
                                );
                            })}

                    </div>

                ))}

            </div>

            <div className="legend">

                <span>
                    <i className="available-box"></i>
                    Available
                </span>

                <span>
                    <i className="selected-box"></i>
                    Selected
                </span>

                <span>
                    <i className="booked-box"></i>
                    Booked
                </span>

                <span>
                    <i className="premium-box"></i>
                    Premium
                </span>

            </div>

            <div className="booking-summary">

                <h3>
                    Selected Seats: {selectedSeats.length}
                </h3>

                <p>
                    {selectedSeatDetails.length === 0
                        ? "No seats selected"
                        : selectedSeatDetails
                            .map(seat => seat.seatNumber)
                            .join(", ")
                    }
                </p>

                <p>
                    Subtotal: ₹{subtotal.toFixed(2)}
                </p>

                <p>
                    GST (18%): ₹{gst.toFixed(2)}
                </p>

                <h2>
                    Total: ₹{totalAmount.toFixed(2)}
                </h2>

                <button
                    className="proceed-button"
                    disabled={selectedSeats.length === 0}
                    onClick={proceedToBooking}
                >
                    Proceed to Booking
                </button>

            </div>

        </div>
    );
}

export default SeatSelection;