// src/components/Login.tsx
import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { loginUser, LoginCredentials } from '../api';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginCredentials>({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      if (res.success) {
        setUser({
          name: res.user.name,
          balance: res.user.balance,
          token: res.token
        });
        navigate('/home');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Parrot Wings Login
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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
