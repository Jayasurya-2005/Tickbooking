import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import MovieList from './components/MovieList'
import MovieShows from './pages/MovieShows'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import SeatSelection from "./pages/SeatSelection";
import BookingConfirmation from "./pages/BookingConfirmation";
import Navbar from './components/Navbar'
function App() {

    return (
        <Router>
            <Navbar />
            <Routes>

                <Route path="/" element={<MovieList />} />
                <Route path="/show/:showId/seats" element={<SeatSelection />}/>
                <Route path="/movie/:movieId" element={<MovieShows />}/>
                <Route path="/booking-confirmation" element={<BookingConfirmation />}/>
            </Routes>

        </Router>
    );
}
export default App;
