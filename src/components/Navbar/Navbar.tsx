import React, { useState } from "react";
import AccountMenu from "./AccountMenu";
import "./style.css";


const Navbar = () => {
    const[menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const handleLogout = () => {
        console.log('User logged out');
        setMenuOpen(false);
    };

    return (
        <nav className="navbar-container">
            <h1 className="navbar-title">My Exams</h1>
            <div className="account-container">
                <span className="contact">Contact</span>
                <span className="account-name">Petar</span>
                <img src="/images/user.png" onClick={toggleMenu} alt="Account icon" className="main_account_icon"/>
                {menuOpen && <AccountMenu />}
            </div>
        </nav>
    );
};

export default Navbar;