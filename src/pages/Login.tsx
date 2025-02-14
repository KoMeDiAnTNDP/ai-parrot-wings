import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { useLoginUserMutation } from '../services/apiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../slices/authSlice';

const Login: React.FC = () => {
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser(form).unwrap();
      dispatch(setToken(data.id_token));
      navigate('/home');
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#F0F2F5', // Adjust this based on the design
      }}
    >
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        {/* Header */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Sign in to Parrot Wings
        </Typography>

        {error && (
          <Typography variant="body1" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5 }}>
            Sign In
          </Button>
        </form>

        {/* Signup Redirect */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link href="/" underline="hover" sx={{ fontWeight: 'bold' }}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
