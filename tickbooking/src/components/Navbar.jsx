import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {

    return (
        <nav className="navbar">

            <Link to="/" className="logo">
                🎬 TickBook
            </Link>

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/">
                    Movies
                </Link>

                <Link to="/my-bookings">
                    My Bookings
                </Link>

            </div>

        </nav>
    );
}

export default Navbar;