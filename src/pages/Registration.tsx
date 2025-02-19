import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, AppBar, Toolbar } from '@mui/material';
import { useRegisterUserMutation } from '../services/apiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../slices/authSlice';

const Registration: React.FC = () => {
  const [registerUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      const data = await registerUser({ email: form.email, username: form.username, password: form.password }).unwrap();
      dispatch(setToken(data.id_token));
      navigate('/home');
    } catch (err) {
      setError('Registration failed.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#EADDFF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "#6750A4" }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <img
            src="https://c.animaapp.com/SC5bodSp/img/parrot-svgrepo-com-1.svg"
            alt="Parrot"
            style={{ width: 50, height: 50 }}
          />
          <Typography variant="h1" color="#F2F2F2" sx={{ marginLeft: 2 }}>
            Parrot Wings
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            padding: 4,
          }}
        >
          <Typography
            variant="h2"
            color="text.primary"
            align="center"
            sx={{ marginBottom: 3 }}
          >
            Become a part of something bigger!
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Email"
              type="email"
              name="email"
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Username"
              type="text"
              name="username"
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Password"
              type="password"
              name="password"
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#6750A4",
                color: "#F2F2F2",
                borderRadius: "100px",
                marginBottom: 2,
                padding: "12px 0",
                "&:hover": {
                  backgroundColor: "#463873"
                }
              }}
            >
              Register
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
              sx={{
                color: "#65558F",
                borderRadius: "100px",
                padding: "12px 0",
                "&:hover": {
                  backgroundColor: "rgba(101, 85, 143, 0.08)"
                }
              }}
            >
              Already have an account?
            </Button>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default Registration;
