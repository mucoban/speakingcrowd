import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary py-4">
            <div className="container">
            <NavLink className="navbar-brand" to="/">Speaking Crowd</NavLink>
            <div>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <NavLink className="nav-link fw-bold" to="test">Teste Başla</NavLink>
                </li>
                <li className="nav-item d-none d-sm-flex">
                    <NavLink className="nav-link fw-bold" to="/">Speaking Crowd Nedir?</NavLink>
                </li>
                </ul>
            </div>
            </div>
        </nav>
    );
}