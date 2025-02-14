// src/components/Registration.tsx
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { registerUser, RegistrationData } from '../api';
import { useNavigate } from 'react-router-dom';

const Registration: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    try {
      // Prepare the registration data (omit confirmPassword)
      const regData: RegistrationData = {
        email: form.email,
        username: form.username,
        password: form.password,
      };
      await registerUser(regData);
      // On success, navigate to login.
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Parrot Wings Registration
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Registration;
