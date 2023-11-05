import React from 'react';
import { HorizontalNavbar } from './Navbar';
import PatientUI from './PatientUI';

export default function Home() {
    return (
        <div className="home">
            <div className="home-navbar">
                <HorizontalNavbar/>
            </div>
            <div className="home-content">
                <div className="Info">
                    <h1> Welcome to Health Journal!</h1>
                </div>
                <div className="About">
                    <h1>About</h1>
                </div>
                <div className="sign-in">
                    <h1>Sign In/Register</h1>
                </div>
            </div>
        </div>
    )
}