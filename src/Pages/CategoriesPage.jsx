import { useState, useEffect, useMemo } from "react";
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
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { getCategories, getExercises } from "../services/backendApi";
import { useTranslation } from "react-i18next";

function CategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [exerciseUsage, setExerciseUsage] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCategories(), getExercises()])
      .then(([catRes, exerciseRes]) => {
        setCategories(catRes.data);
        const usage = (exerciseRes.data || []).reduce((acc, item) => {
          const name = String(item.category || "");
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {});
        setExerciseUsage(usage);
        setError("");
      })
      .catch(() => setError(t("categories.loadError")))
      .finally(() => setLoading(false));
  }, [t]);

  const pinnedCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) => (exerciseUsage[b.name] || 0) - (exerciseUsage[a.name] || 0))
      .filter((cat) => (exerciseUsage[cat.name] || 0) > 0)
      .slice(0, 3);
  }, [categories, exerciseUsage]);

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

      {!loading && pinnedCategories.length > 0 && (
        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PushPinOutlinedIcon color="secondary" />
                <Typography variant="h6">{t("categories.pinnedTitle")}</Typography>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {pinnedCategories.map((cat) => (
                  <Chip
                    key={cat.id}
                    component={Link}
                    to={`/categories/${encodeURIComponent(cat.name)}`}
                    clickable
                    color="secondary"
                    variant="outlined"
                    label={`${cat.name} (${exerciseUsage[cat.name] || 0})`}
                  />
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

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