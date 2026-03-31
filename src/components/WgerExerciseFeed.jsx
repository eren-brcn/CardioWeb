import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { WGER_API_URL } from "../config/api";

function WgerExerciseFeed({ onImportExercise }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 12;

  useEffect(() => {
    const loadWgerExercises = async () => {
      try {
        setError("");
        setLoading(true);

        const response = await axios.get(`${WGER_API_URL}/exerciseinfo/`, {
          params: {
            language: 2,
            limit: PAGE_SIZE,
            offset: 0
          }
        });

        setExercises(response.data?.results || []);
        setOffset(PAGE_SIZE);
        setHasMore(Boolean(response.data?.next));
      } catch {
        setError("Could not load exercises from WGER API.");
      } finally {
        setLoading(false);
      }
    };

    loadWgerExercises();
  }, []);

  const categories = useMemo(() => {
    const names = exercises
      .map((exercise) => exercise.category?.name)
      .filter(Boolean);
    return ["All", ...new Set(names)];
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const matchesCategory =
        selectedCategory === "All" || exercise.category?.name === selectedCategory;
      const matchesQuery =
        !normalizedQuery ||
        String(exercise.name || "").toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [exercises, query, selectedCategory]);

  const handleLoadMore = async () => {
    try {
      setError("");
      setLoadingMore(true);

      const response = await axios.get(`${WGER_API_URL}/exerciseinfo/`, {
        params: {
          language: 2,
          limit: PAGE_SIZE,
          offset
        }
      });

      const nextItems = response.data?.results || [];
      setExercises((prev) => [...prev, ...nextItems]);
      setOffset((prev) => prev + PAGE_SIZE);
      setHasMore(Boolean(response.data?.next));
    } catch {
      setError("Could not load more exercises right now.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PublicOutlinedIcon color="primary" />
            <Typography variant="h5">WGER Exercise Feed</Typography>
            <Chip label="Live API" size="small" color="secondary" />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              label="Search WGER exercises"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Filter category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              sx={{ minWidth: { md: 220 } }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))"
                }
              }}
            >
              {filteredExercises.map((exercise) => (
                <Box
                  key={exercise.id}
                  sx={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 2,
                    p: 1.5,
                    backgroundColor: "rgba(255,255,255,0.02)"
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {exercise.name || "Unnamed exercise"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {exercise.category?.name || "General"}
                  </Typography>
                  <Button
                    size="small"
                    sx={{ mt: 1 }}
                    variant="outlined"
                    onClick={() => onImportExercise?.(exercise)}
                  >
                    Import to my workout
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          {!loading && filteredExercises.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No WGER exercises match your search.
            </Typography>
          )}

          {!loading && hasMore && (
            <Box>
              <Button variant="contained" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load more"}
              </Button>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default WgerExerciseFeed;
