import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './styles/register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [redirect, setRedirect] = useState(false);

    let navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
            setSuccessMessage(response.data.message);
            setRedirect(true);
            navigate("/login");
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    if (redirect) {
        return <Link to="/login" />;
    }

    return (
        <div className="container form-width">
            <h2 className="title">Register</h2>
            <Form onSubmit={handleSubmit} className="register-form">
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" name="name" value={formData.name} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                </Form.Group>
                <br></br>
                <center>
                    <Button variant="dark" type="submit">
                        Register
                    </Button>
                </center>
                <br></br>
                <center>
                    {error && <div className="error">{error}</div>}
                    {successMessage && <div className="success">{successMessage}</div>}
                </center>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </Form>
        </div>
    );
};

export default Register;
