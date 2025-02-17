import React from 'react';

const Header = () => {
    return (
        <header id="top-of-page">
        <h1> Welcome to Heikki's React App </h1>
        <nav>
            <ul className="navbar">
                <li><a href="#introduction">Introduction</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    )
}

export default Header