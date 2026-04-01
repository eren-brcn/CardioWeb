import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { loginUser } from "../services/authApi";
import { saveAuthSession } from "../services/authStorage";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await loginUser(formData);
      saveAuthSession(response.data);
      setSuccessMessage("Login successful. Redirecting...");
      setTimeout(() => navigate("/"), 500);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: { xs: 2, md: 5 } }}>
      <Card sx={{ width: "100%", maxWidth: 520 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={2.5} component="form" onSubmit={handleSubmit} noValidate>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                Welcome Back
              </Typography>
              <Typography color="text.secondary">
                Log in to continue tracking your workouts and progress.
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <TextField
              required
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              fullWidth
            />

            <TextField
              required
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              fullWidth
            />

            <Button type="submit" variant="contained" size="large" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </Button>

            <Typography variant="body2" color="text.secondary">
              New here? <Link to="/signup">Create an account</Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;
