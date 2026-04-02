import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import { getProgram, updateProgram } from "../services/backendApi";

const difficulties = ["beginner", "intermediate", "advanced"];
const intensityLevels = ["low", "medium", "high"];

function ProgramDetailPage() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [phases, setPhases] = useState([]);

  // Phase editor state
  const [openPhaseDialog, setOpenPhaseDialog] = useState(false);
  const [editingPhaseIndex, setEditingPhaseIndex] = useState(null);
  const [phaseWeek, setPhaseWeek] = useState("");
  const [phaseDescription, setPhaseDescription] = useState("");
  const [phaseExercises, setPhaseExercises] = useState([]);

  // Exercise editor state
  const [openExerciseDialog, setOpenExerciseDialog] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseSets, setExerciseSets] = useState("3");
  const [exerciseReps, setExerciseReps] = useState("8");
  const [exerciseIntensity, setExerciseIntensity] = useState("medium");
  const [editingExerciseIndex, setEditingExerciseIndex] = useState(null);

  useEffect(() => {
    loadProgram();
  }, [programId]);

  const loadProgram = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await getProgram(programId);
      const data = res.data;
      setProgram(data);
      setName(data.name);
      setDescription(data.description || "");
      setDuration(String(data.duration));
      setDifficulty(data.difficulty);
      setPhases(data.phases || []);
    } catch {
      setError(t("programDetail.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProgram = async () => {
    try {
      setError("");
      setSaving(true);
      await updateProgram(programId, {
        name: name.trim(),
        description: description.trim(),
        duration: Number(duration),
        difficulty,
        phases
      });
      setError("");
    } catch {
      setError(t("programDetail.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhase = () => {
    setPhaseWeek("");
    setPhaseDescription("");
    setPhaseExercises([]);
    setEditingPhaseIndex(null);
    setOpenPhaseDialog(true);
  };

  const handleEditPhase = (index) => {
    const phase = phases[index];
    setPhaseWeek(String(phase.week));
    setPhaseDescription(phase.description || "");
    setPhaseExercises(phase.exercises || []);
    setEditingExerciseIndex(null);
    setEditingPhaseIndex(index);
    setOpenPhaseDialog(true);
  };

  const handleSavePhase = () => {
    if (!phaseWeek.trim()) {
      setError(t("programDetail.phaseWeekRequired"));
      return;
    }

    const newPhase = {
      week: Number(phaseWeek),
      description: phaseDescription.trim(),
      exercises: phaseExercises
    };

    if (editingPhaseIndex !== null) {
      const newPhases = [...phases];
      newPhases[editingPhaseIndex] = newPhase;
      setPhases(newPhases);
    } else {
      setPhases([...phases, newPhase]);
    }

    setOpenPhaseDialog(false);
    setError("");
  };

  const handleDeletePhase = (index) => {
    setPhases((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddExercise = () => {
    setExerciseName("");
    setExerciseSets("3");
    setExerciseReps("8");
    setExerciseIntensity("medium");
    setEditingExerciseIndex(null);
    setOpenExerciseDialog(true);
  };

  const handleEditExercise = (index) => {
    const exercise = phaseExercises[index];
    setExerciseName(exercise.name);
    setExerciseSets(String(exercise.sets));
    setExerciseReps(String(exercise.reps));
    setExerciseIntensity(exercise.intensity);
    setEditingExerciseIndex(index);
    setOpenExerciseDialog(true);
  };

  const handleSaveExercise = () => {
    if (!exerciseName.trim()) {
      setError(t("programDetail.exerciseNameRequired"));
      return;
    }

    const newExercise = {
      name: exerciseName.trim(),
      sets: Number(exerciseSets),
      reps: Number(exerciseReps),
      intensity: exerciseIntensity
    };

    if (editingExerciseIndex !== null) {
      const newExercises = [...phaseExercises];
      newExercises[editingExerciseIndex] = newExercise;
      setPhaseExercises(newExercises);
    } else {
      setPhaseExercises([...phaseExercises, newExercise]);
    }

    setOpenExerciseDialog(false);
    setError("");
  };

  const handleDeleteExercise = (index) => {
    setPhaseExercises((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{t("programDetail.title")}</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label={t("programs.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label={t("programs.description")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              minRows={3}
              fullWidth
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={t("programs.duration")}
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                fullWidth
              />
              <TextField
                select
                label={t("programs.difficulty")}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                fullWidth
              >
                {difficulties.map((level) => (
                  <MenuItem key={level} value={level}>
                    {t(`programs.levels.${level}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Button
              variant="contained"
              onClick={handleSaveProgram}
              disabled={saving}
            >
              {saving ? t("programDetail.saving") : t("programDetail.save")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">{t("programDetail.phases")}</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddPhase}
                size="small"
              >
                {t("programDetail.addPhase")}
              </Button>
            </Box>

            {phases.length === 0 ? (
              <Typography color="text.secondary">
                {t("programDetail.noPhases")}
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {phases.map((phase, idx) => (
                  <Card
                    key={idx}
                    variant="outlined"
                    sx={{ backgroundColor: "rgba(0,194,168,0.05)" }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          mb: 1
                        }}
                      >
                        <Box>
                          <Chip
                            label={`Week ${phase.week}`}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          {phase.description && (
                            <Typography variant="body2" color="text.secondary">
                              {phase.description}
                            </Typography>
                          )}
                        </Box>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditPhase(idx)}
                          >
                            📝
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeletePhase(idx)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Stack>
                      </Box>

                      {phase.exercises && phase.exercises.length > 0 ? (
                        <Stack spacing={1} sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {t("programDetail.exercises")}
                          </Typography>
                          {phase.exercises.map((ex, exIdx) => (
                            <Box
                              key={exIdx}
                              sx={{
                                p: 1,
                                backgroundColor: "rgba(255,255,255,0.05)",
                                borderRadius: 1,
                                fontSize: "0.875rem"
                              }}
                            >
                              <Typography variant="body2">
                                {ex.name} - {ex.sets}x{ex.reps} ({ex.intensity})
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                          {t("programDetail.noExercises")}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Phase Dialog */}
      <Dialog open={openPhaseDialog} onClose={() => setOpenPhaseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPhaseIndex !== null ? t("programDetail.editPhase") : t("programDetail.addPhase")}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label={t("programDetail.week")}
              type="number"
              value={phaseWeek}
              onChange={(e) => setPhaseWeek(e.target.value)}
              fullWidth
              inputProps={{ min: 1 }}
            />
            <TextField
              label={t("programDetail.phaseDescription")}
              value={phaseDescription}
              onChange={(e) => setPhaseDescription(e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />

            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle2">
                  {t("programDetail.exercises")}
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddExercise}
                  size="small"
                >
                  {t("programDetail.add")}
                </Button>
              </Box>

              {phaseExercises.length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  {t("programDetail.noExercises")}
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {phaseExercises.map((ex, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 1,
                        backgroundColor: "rgba(255,255,255,0.08)",
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <Typography variant="body2">
                        {ex.name} ({ex.sets}x{ex.reps})
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditExercise(idx)}
                        >
                          📝
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteExercise(idx)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPhaseDialog(false)}>
            {t("programDetail.cancel")}
          </Button>
          <Button
            onClick={handleSavePhase}
            variant="contained"
          >
            {t("programDetail.save")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exercise Dialog */}
      <Dialog open={openExerciseDialog} onClose={() => setOpenExerciseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingExerciseIndex !== null ? t("programDetail.editExercise") : t("programDetail.addExercise")}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label={t("exercise.name")}
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              fullWidth
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={t("programDetail.sets")}
                type="number"
                value={exerciseSets}
                onChange={(e) => setExerciseSets(e.target.value)}
                fullWidth
                inputProps={{ min: 1 }}
              />
              <TextField
                label={t("programDetail.reps")}
                type="number"
                value={exerciseReps}
                onChange={(e) => setExerciseReps(e.target.value)}
                fullWidth
                inputProps={{ min: 1 }}
              />
            </Stack>
            <TextField
              select
              label={t("programDetail.intensity")}
              value={exerciseIntensity}
              onChange={(e) => setExerciseIntensity(e.target.value)}
              fullWidth
            >
              {intensityLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExerciseDialog(false)}>
            {t("programDetail.cancel")}
          </Button>
          <Button
            onClick={handleSaveExercise}
            variant="contained"
          >
            {t("programDetail.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default ProgramDetailPage;
