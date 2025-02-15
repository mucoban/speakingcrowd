import { NavLink } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

export default function Navbar() {
    const { isLoggedIn, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary py-4">
            <div className="container">
            <NavLink className="navbar-brand" to="/">Speaking Crowd</NavLink>
            <div>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <NavLink className="nav-link fw-bold" to="tests">Teste Başla</NavLink>
                </li>
                <li className="nav-item d-none d-sm-flex">
                    <NavLink className="nav-link fw-bold" to="/">Speaking Crowd Nedir?</NavLink>
                </li>
                {isLoggedIn ? 
                    <>
                        <li className="nav-item d-none d-sm-flex">
                            <NavLink className="nav-link fw-bold" to="/profile">P</NavLink>
                        </li>
                        <li className="nav-item d-none d-sm-flex">
                            <NavLink className="nav-link fw-bold" onClick={logout}>Logout</NavLink>
                        </li>
                    </>
                     :
                    <li className="nav-item d-none d-sm-flex">
                        <NavLink className="nav-link fw-bold" to="/login">Login</NavLink>
                    </li>
                }
                </ul>
            </div>
            </div>
        </nav>
    );
}