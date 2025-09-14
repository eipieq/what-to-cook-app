import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navigation.css'

const Navigation = () => {
    const navigate = useNavigate();
    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className='navigation'>
            <h3 className='nav-logo' onClick={() => handleNavigation('/')}>
                What To Cook?
            </h3>
            <div className='nav-menu'>
                <button
                    className='nav-item'
                    onClick={() => handleNavigation('/preferences')}
                >
                    Find Recipe
                </button>
                <button
                    className='nav-item'
                    onClick={() => handleNavigation('/about')}
                >
                    About
                </button>
            </div>
        </nav>
    )
}

export default Navigation;