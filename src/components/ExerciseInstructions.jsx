import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import { getExerciseImages, getExerciseDescriptions } from "../services/wgerApi";

function ExerciseInstructions({ open, exerciseId, exerciseName, onClose }) {
  const [images, setImages] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!open || !exerciseId) {
      return;
    }

    const loadExerciseData = async () => {
      try {
        setError("");
        setLoading(true);

        const [imgRes, descRes] = await Promise.all([
          getExerciseImages(exerciseId),
          getExerciseDescriptions(exerciseId)
        ]);

        setImages(imgRes.data?.results || []);
        setDescriptions(descRes.data?.results || []);
      } catch {
        setError("Could not load exercise details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadExerciseData();
  }, [open, exerciseId]);

  const currentImage = images[currentImageIndex];

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backdropFilter: "blur(10px)"
        }
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Stack spacing={0.5}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {exerciseName || "Exercise Instructions"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Step-by-step guide and technique
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!loading && (
          <Stack spacing={3}>
            {/* Images Section */}
            {images.length > 0 ? (
              <Card sx={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        position: "relative",
                        paddingBottom: "75%",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        borderRadius: 2,
                        overflow: "hidden"
                      }}
                    >
                      {currentImage && (
                        <Box
                          component="img"
                          src={currentImage.image}
                          alt={exerciseName}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                      )}
                    </Box>

                    {/* Image Navigation */}
                    {images.length > 1 && (
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <IconButton
                          onClick={handlePreviousImage}
                          size="small"
                          sx={{ color: "text.secondary" }}
                        >
                          <ChevronLeftIcon />
                        </IconButton>
                        <Typography variant="caption" color="text.secondary">
                          {currentImageIndex + 1} / {images.length}
                        </Typography>
                        <IconButton
                          onClick={handleNextImage}
                          size="small"
                          sx={{ color: "text.secondary" }}
                        >
                          <ChevronRightIcon />
                        </IconButton>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <Alert severity="info">No images available for this exercise yet.</Alert>
            )}

            {/* Instructions Section */}
            {descriptions.length > 0 ? (
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FitnessCenterOutlinedIcon color="primary" />
                  <Typography variant="h6">How to perform</Typography>
                </Stack>

                <Stack spacing={2}>
                  {descriptions.map((desc, idx) => (
                    <Card
                      key={desc.id}
                      sx={{
                        borderLeft: "4px solid",
                        borderLeftColor: "primary.main",
                        backgroundColor: "rgba(255,255,255,0.02)"
                      }}
                    >
                      <CardContent>
                        <Stack spacing={1}>
                          <Chip
                            label={`Step ${idx + 1}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ alignSelf: "flex-start" }}
                          />
                          <Typography sx={{ lineHeight: 1.8 }}>
                            {desc.description}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            ) : (
              <Alert severity="info">No detailed instructions available yet.</Alert>
            )}

            {/* Empty State */}
            {images.length === 0 && descriptions.length === 0 && !error && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography color="text.secondary">
                  No images or instructions available for this exercise.
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "flex-end" }}>
        <Button onClick={onClose} variant="contained"  sx={{ borderRadius: 1 }}>
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExerciseInstructions;
