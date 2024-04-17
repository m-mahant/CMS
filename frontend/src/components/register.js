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
    const [validationErrors, setValidationErrors] = useState({
        name: '',
        email: '',
        password: '',
    });

    let navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        if (!formData.name) {
            setValidationErrors({ ...validationErrors, name: 'Please enter your username.' });
            return;
        }

        if (!formData.email) {
            setValidationErrors({ ...validationErrors, email: 'Please enter your email.' });
            return;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setValidationErrors({ ...validationErrors, email: 'Please enter a valid email address.' });
            return;
        }

        if (!formData.password) {
            setValidationErrors({ ...validationErrors, password: 'Please enter your password.' });
            return;
        } else if (formData.password.length < 6) {
            setValidationErrors({ ...validationErrors, password: 'Password must be at least 6 characters long.' });
            return;
        }

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
                    <Form.Text className="text-danger">{validationErrors.name}</Form.Text>
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
                    <Form.Text className="text-danger">{validationErrors.email}</Form.Text>
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                    <Form.Text className="text-danger">{validationErrors.password}</Form.Text>
                </Form.Group>
                <br /><br />
                <center>
                    <Button variant="dark" type="submit">
                        Register
                    </Button>
                </center>
                <br />
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
