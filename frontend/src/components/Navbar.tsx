import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink to="/" end>
                    Geo Converter
                </NavLink>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/simple"
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                        Simple Converter
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/advanced"
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                        Advanced Converter
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
