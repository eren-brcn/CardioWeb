import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SearchIcon from "@mui/icons-material/Search";
import AddExercise from "./AddExercise";
import { API_URL } from "../config/api";

function ExerciseList({ importedExercise }) {
  const [exercises, setExercises] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExercises = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await axios.get(`${API_URL}/exercises`);
      const sortedExercises = [...response.data].sort((a, b) =>
        String(a.title).localeCompare(String(b.title))
      );
      setExercises(sortedExercises);
    } catch {
      setError("Could not load exercises. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const filteredExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return exercises;
    }

    return exercises.filter((exercise) => {
      const title = String(exercise.title ?? "").toLowerCase();
      const category = String(exercise.category ?? "").toLowerCase();
      return title.includes(normalizedQuery) || category.includes(normalizedQuery);
    });
  }, [exercises, query]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/exercises/${id}`);
      setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
    } catch {
      setError("Could not delete this exercise.");
    }
  };

  return (
    <Stack spacing={3}>
      <AddExercise onExerciseAdded={loadExercises} importedExercise={importedExercise} />

      <TextField
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        label="Search exercise or category"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          )
        }}
      />

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress color="primary" />
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
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <FitnessCenterIcon color="primary" fontSize="small" />
                      <Typography variant="h6">{exercise.title}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip label={exercise.category} size="small" color="primary" variant="outlined" />
                      <Chip label={`${exercise.currentWeight} kg`} size="small" color="secondary" />
                    </Stack>
                  </Box>

                  <Tooltip title="Delete exercise">
                    <IconButton
                      color="error"
                      aria-label={`Delete ${exercise.title}`}
                      onClick={() => handleDelete(exercise.id)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {!loading && filteredExercises.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          No matching exercise found.
        </Typography>
      )}
    </Stack>
  );
}

export default ExerciseList;
