import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import '../styles/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const handleGetStarted = () => {
        navigate('/preferences');
    };

    return (
        <div className='landing-page'>
            <Navigation />
            <div className='content'>
                <h1>Can't decide what to cook?</h1>
                <button
                    className='get-started'
                    onClick={handleGetStarted}
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default LandingPage;