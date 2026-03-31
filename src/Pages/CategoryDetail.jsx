import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import { API_URL } from "../config/api";

function CategoryDetail() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const decodedCategoryName = decodeURIComponent(categoryName || "");

  const [categoryInfo, setCategoryInfo] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getDetailData = async () => {
      try {
        setError("");
        setLoading(true);
        const [catRes, exRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/exercises`)
        ]);

        // Matches the name from the URL to the JSON data
        const foundCat = catRes.data.find(
          (c) => String(c.name).toLowerCase() === decodedCategoryName.toLowerCase()
        );
        setCategoryInfo(foundCat);

        // Filters list to show only exercises for this category
        const filteredEx = exRes.data.filter(
          (ex) => String(ex.category).toLowerCase() === decodedCategoryName.toLowerCase()
        );
        setExercises(filteredEx);
      } catch {
        setError("Could not load this guide right now.");
      } finally {
        setLoading(false);
      }
    };

    getDetailData();
  }, [decodedCategoryName]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!categoryInfo) {
    return (
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <Typography variant="h4">Category not found</Typography>
        <Button component={Link} to="/categories" startIcon={<ArrowBackIcon />}>
          Back to Categories
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <Button onClick={() => navigate(-1)} sx={{ alignSelf: "flex-start" }} startIcon={<ArrowBackIcon />}>
        Back to Categories
      </Button>

      <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} spacing={2}>
        <Typography variant="h3" component="h1">
          {categoryInfo.name} Guide
        </Typography>
        <Chip label={`${exercises.length} linked exercises`} color="secondary" />
      </Stack>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, minmax(0, 1fr))"
          }
        }}
      >
        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AutoStoriesOutlinedIcon color="primary" />
                <Typography variant="h6">About this training</Typography>
              </Stack>
              <Typography color="text.secondary">
                {categoryInfo.description || "No description available yet."}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BuildCircleOutlinedIcon color="primary" />
                <Typography variant="h6">How to perform</Typography>
              </Stack>
              <Typography color="text.secondary">{categoryInfo.howTo || "Instructions coming soon."}</Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BoltOutlinedIcon color="primary" />
                <Typography variant="h6">Benefit</Typography>
              </Stack>
              <Typography color="text.secondary">
                {categoryInfo.benefit || "Benefits will be updated shortly."}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Related Exercises
          </Typography>

          {exercises.length > 0 ? (
            <Stack spacing={1.2}>
              {exercises.map((ex) => (
                <Stack
                  key={ex.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    py: 1.2,
                    px: 1.5,
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.08)",
                    backgroundColor: "rgba(255,255,255,0.02)"
                  }}
                >
                  <Typography>{ex.title}</Typography>
                  <Chip label={`${ex.currentWeight} kg`} size="small" color="primary" variant="outlined" />
                </Stack>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">No exercises added for this category yet.</Typography>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}

export default CategoryDetail;