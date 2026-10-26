
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { movieApi } from '../services/api';


export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  const toggleSeat = (seat) => {
    setError('');

    setSelectedSeats((previousSeats) => {
      const alreadySelected = previousSeats.some(
        (selectedSeat) => selectedSeat.seatId === seat.seatId
      );

      if (alreadySelected) {
        return previousSeats.filter(
          (selectedSeat) => selectedSeat.seatId !== seat.seatId
        );
      }

      return [...previousSeats, seat];
    });
  };

  async function proceedToBooking() {
    const token = localStorage.getItem('tickbookToken');

    if (!token) {
      navigate('/login', {
        state: {
          from: {
            pathname: `/seats/${showId}`,
          },
        },
      });
      return;
    }

    if (!selectedSeats.length) {
      setError('Please select at least one seat.');
      return;
    }

    setBooking(true);
    setError('');

    try {
      const { data } = await movieApi.post(
        '/booking',
        {
          showId: Number(showId),
          seatIds: selectedSeats.map((seat) => seat.seatId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate('/booking/confirmation', {
        state: {
          booking: data,
          seats: selectedSeats,
        },
      });
    }catch (requestError) {
  const status = requestError?.response?.status;

  const backendMessage =
    requestError?.response?.data?.message ||
    requestError?.response?.data?.error ||
    '';

  if (status === 401 || status === 403) {
    setError('Your session may have expired. Please log in again before booking.');
  } else {
    const seatConflict =
      status === 409 || /seat|booked|available/i.test(backendMessage);

    setError(
      seatConflict
        ? 'One or more selected seats are no longer available. Please choose different seats.'
        : backendMessage || 'Your booking could not be completed. Please try again.'
    );
  }
} finally {
  setBooking(false);
}
  }

  return (
    <div className="seat-selection-container">
      <h2>Select Your Seats</h2>

      <div className="selected-seats">
        <h3>Selected Seats</h3>

        {selectedSeats.length > 0 ? (
          <div>
            {selectedSeats.map((seat) => (
              <span key={seat.seatId}>
                {seat.rowName}
                {seat.seatNumber}{' '}
              </span>
            ))}
          </div>
        ) : (
          <p>No seats selected.</p>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      <button
        type="button"
        onClick={proceedToBooking}
        disabled={booking || selectedSeats.length === 0}
      >
        {booking ? 'Processing...' : 'Proceed to Booking'}
      </button>
    </div>
  );
}

