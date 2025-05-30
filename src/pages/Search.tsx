import React from 'react';
import { NavBar } from '../components/Navbar';
import Footer from '../components/Footer';
import './Search.css'; 

export function Search () {
    return (
        <div className="search-page">
            <NavBar />
            <Footer />
        </div>
    );
}
