import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/navbar.css';
import Button from 'react-bootstrap/Button';

const Navbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isLoggedIn = !!localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">Blogs</Link>
            </div>
            <div className="navbar-middle">
                <ul className="navbar-list">
                    <li className="navbar-item"><Link to="/" className="navbar-link">Home</Link></li>
                </ul>
            </div>
            <div className="navbar-button">
                <ul className="navbar-list">
                    {isLoggedIn && (
                        <Link to="/create"><Button variant="success">Create Blog</Button>{' '}</Link>
                    )}
                </ul>
            </div>
            <div className="navbar-right">
                {isLoggedIn ? (
                    <div className="navbar-user">
                        <span className="navbar-username">Welcome, {user}！</span>
                        <Button variant="light" onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</Button>
                    </div>
                ) : (
                    <>
                        <Link to="/login"><Button variant="dark">Login</Button>{' '}</Link>
                        <Link to="/register"><Button variant="light">Register</Button>{' '}</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
