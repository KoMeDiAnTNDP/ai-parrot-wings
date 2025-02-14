import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { useRegisterUserMutation } from '../services/apiSlice';
import { useNavigate } from 'react-router-dom';

const Registration: React.FC = () => {
  const [registerUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);

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
      await registerUser({ email: form.email, username: form.username, password: form.password }).unwrap();
      navigate('/login');
    } catch (err) {
      setError('Registration failed.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Register
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField label="Email" fullWidth name="email" onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField label="Username" fullWidth name="username" onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField label="Password" fullWidth name="password" type="password" onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField label="Confirm Password" fullWidth name="confirmPassword" type="password" onChange={handleChange} required sx={{ mb: 2 }} />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account? <Link href="/login">Sign In</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Registration;
