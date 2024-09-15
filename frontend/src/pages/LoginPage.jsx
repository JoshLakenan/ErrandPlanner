import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Alert,
  Link,
} from "@mui/material";
import { loginUser } from "../services/authService";
import { useLocation, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  /**
   * Clears location alert state
   * @returns {void}
   */
  const handleClearAlert = () => {
    if (location.state?.alert) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  };

  const handleInputChange = (e) => {
    handleClearErrors();
    handleClearAlert();

    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Validates the form data and sets the errors state accordingly.
   * @returns {boolean} - Whether the form is valid or not
   */
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      username: "",
      password: "",
    };

    if (!formData.username) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  /**
   * Clears the form errors and login error states.
   * Used when the user changes the form data.
   * @returns {void}
   */
  const handleClearErrors = () => {
    setFormErrors({
      username: "",
      password: "",
    });

    setLoginError("");
  };

  /**
   * Handles the form submission, registering the user and displaying setting
   * the register error state if an error occurs.
   * @param {Event} e - The form submission event
   * @returns {void}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      console.error("Form is invalid");
      return;
    }

    const { username, password } = formData;

    try {
      // Get the user data from the server
      const user = await loginUser(username, password);

      // Store the jwt token in session storage
      sessionStorage.setItem("jwt", user.token);

      // Redirect to the main page
      navigate("/", {
        replace: true,
        state: {
          alert: { message: `Welcome, ${user.username}!`, type: "success" },
          user: { username: user.username },
        },
      });
    } catch (error) {
      setLoginError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        {location.state?.alert && (
          <Alert severity={location.state.alert.type} sx={{ mb: 2 }}>
            {location.state.alert.message}
          </Alert>
        )}

        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                name="username"
                fullWidth
                variant="outlined"
                value={formData.username}
                onChange={handleInputChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                variant="outlined"
                value={formData.password}
                onChange={handleInputChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography align="center" sx={{ mt: 2 }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/register")}
                >
                  Don't have an account? Register here.
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
