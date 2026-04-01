import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { getCategories } from "../services/backendApi";
import { useTranslation } from "react-i18next";

function CategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // // Fetching the categories backend  
    getCategories()
      .then((res) => {
        setCategories(res.data);
        setError("");
      })
      .catch(() => setError(t("categories.loadError")))
      .finally(() => setLoading(false));
  }, [t]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom>
          {t("categories.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("categories.subtitle")}
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))"
            }
          }}
        >
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardActionArea component={Link} to={`/categories/${encodeURIComponent(cat.name)}`} sx={{ height: "100%" }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Avatar sx={{ bgcolor: "primary.main", color: "#03211d", fontWeight: 800 }}>
                        {cat.name?.slice(0, 1)}
                      </Avatar>
                      <Chip icon={<ArrowOutwardIcon />} label={t("categories.open")} size="small" />
                    </Stack>
                    <Typography variant="h5">{cat.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {cat.description || t("categories.exploreFallback", { category: cat.name })}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </Stack>
  );
}

export default CategoriesPage;