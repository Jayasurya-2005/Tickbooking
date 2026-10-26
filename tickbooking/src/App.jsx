import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import BookingConfirmation from './pages/BookingConfirmation.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import MovieShows from './pages/MovieShows.jsx'
import Profile from './pages/Profile.jsx'
import Register from './pages/Register.jsx'
import SeatSelection from './pages/SeatSelection.jsx'
import './App.css'

function SeatSelectionRoute() {
  const { showId } = useParams()
  return <SeatSelection key={showId} />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <Navbar />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:movieId" element={<MovieShows />} />
              <Route path="/show/:showId/seats" element={<SeatSelectionRoute />} />
              <Route path="/booking/confirmation" element={<BookingConfirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="site-footer">TickBook <span>·</span> Your next story starts here.</footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
