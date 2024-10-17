import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import axios from "axios";

// Example logo and illustration URLs (replace with actual images)
const logoUrl = "https://via.placeholder.com/150"; // Placeholder for logo
const illustrationUrl = "https://via.placeholder.com/600"; // Placeholder for illustration

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username,
          password,
        },
      );

      const { token } = response.data;
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <Container component="main" maxWidth="false" disableGutters>
      <Grid container sx={{ height: "100vh" }}>
        {/* Left Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 15,
          }}
        >
          <img src={logoUrl} alt="App Logo" style={{ marginBottom: "20px" }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{ marginBottom: 2 }}
              >
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginTop: 2, float: "Right" }}
            >
              Login
            </Button>
          </form>
        </Grid>

        {/* Right Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#f0f0f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 3,
          }}
        >
          <img
            src={illustrationUrl}
            alt="App Illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
