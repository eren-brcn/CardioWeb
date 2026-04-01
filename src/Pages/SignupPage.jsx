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
import { registerUser } from "../services/authApi";
import { saveAuthSession } from "../services/authStorage";
import { useTranslation } from "react-i18next";

function SignupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
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

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(t("auth.fillAllFields"));
      return;
    }

    if (formData.password.length < 6) {
      setError(t("auth.passwordMin"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.passwordsMismatch"));
      return;
    }

    try {
      setSubmitting(true);
      const response = await registerUser({
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      saveAuthSession(response.data);
      setSuccessMessage(t("auth.signupSuccess"));
      setTimeout(() => navigate("/"), 500);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || t("auth.signupFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: { xs: 2, md: 5 } }}>
      <Card sx={{ width: "100%", maxWidth: 560 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={2.5} component="form" onSubmit={handleSubmit} noValidate>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                {t("auth.signupTitle")}
              </Typography>
              <Typography color="text.secondary">
                {t("auth.signupSubtitle")}
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <TextField
              required
              label={t("auth.fullName")}
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
              fullWidth
            />

            <TextField
              required
              label={t("auth.email")}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              fullWidth
            />

            <TextField
              required
              label={t("auth.password")}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              fullWidth
            />

            <TextField
              required
              label={t("auth.confirmPassword")}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              fullWidth
            />

            <Button type="submit" variant="contained" size="large" disabled={submitting}>
              {submitting ? t("auth.creatingAccount") : t("nav.signup")}
            </Button>

            <Typography variant="body2" color="text.secondary">
              {t("auth.alreadyHaveAccount")} <Link to="/login">{t("nav.login")}</Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SignupPage;
