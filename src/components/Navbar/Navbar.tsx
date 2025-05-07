import React, { Dispatch, SetStateAction, useState } from "react";
import "./style.css";
import AccountMenu from "./AccountMenu";


interface themeProps {
    themeMode: string;
    setThemeMode: Dispatch<SetStateAction<string>>;
}

const Navbar = ({themeMode, setThemeMode}: themeProps) => {
    const[menuOpen, setMenuOpen] = useState(false);

    const handleThemeToggle = () => {
        const newTheme = (themeMode === "light") ? "dark" : "light";
        setThemeMode(newTheme);

        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <nav className="navbar-container">
            {/* <h1 className="navbar-title">My Exams</h1> */}
            <div className="account-container">
                <img
                    src={themeMode === "light" ? "/images/Moon.svg" : "/images/Sun.svg"} 
                    alt="Toggle theme" 
                    onClick={handleThemeToggle} 
                    style={{ cursor: 'pointer' }}
                />
                {/* <span className="contact">Contact</span>
                <span className="account-name">Petar</span> */}
                {/* <img src="/images/user.png" onClick={toggleMenu} alt="Account icon" className="main_account_icon"/>
                {menuOpen && <AccountMenu />} */}
            </div>
        </nav>
    );
};

export default Navbar;