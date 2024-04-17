import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './styles/login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({
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

        if (!formData.email) {
            setValidationErrors({ ...validationErrors, email: 'Please enter your email.' });
            return;
        }

        if (!formData.password) {
            setValidationErrors({ ...validationErrors, password: 'Please enter your password.' });
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
            const { api_token, name, user_id } = response.data;
            localStorage.setItem('token', api_token);
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('user', JSON.stringify(name));
            console.log('Login successful:', response.data);
            navigate("/");
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <div className="container form-width">
            <h2 className="title">Login</h2>
            <Form onSubmit={handleSubmit} className="login-form">
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
                <br></br>
                <center>
                    <Button variant="dark" type="submit">
                        Login
                    </Button>
                </center>
                <br></br>
                <center>
                    {error && <div className="error">{error}</div>}
                </center>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </Form>
        </div>
    );
};

export default Login;
