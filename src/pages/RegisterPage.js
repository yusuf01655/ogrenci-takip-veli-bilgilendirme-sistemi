import React from 'react';
import { Container, Box } from '@mui/material';
import RegisterForm from '../component/Auth/RegisterForm';
import '../styles/register.css'; // CSS dosyasını import et

const RegisterPage = () => {
    return (
        <Container component="main" className="register-container">
            <RegisterForm />
        </Container>
    );
};

export default RegisterPage;