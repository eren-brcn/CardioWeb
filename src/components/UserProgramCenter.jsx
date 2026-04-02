import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { createProgram, deleteProgram, getMyProgress, getMyPrograms } from "../services/backendApi";
import { useTranslation } from "react-i18next";

const difficulties = ["beginner", "intermediate", "advanced"];

function UserProgramCenter() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [programs, setPrograms] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("8");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [description, setDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const chartData = useMemo(() => {
    return (progress?.exerciseProgress || []).map((item) => ({
      exercise: item.exerciseName,
      improvement: item.improvementKg,
      sessions: item.sessions
    }));
  }, [progress]);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [programRes, progressRes] = await Promise.all([getMyPrograms(), getMyProgress()]);
      setPrograms(programRes.data || []);
      setProgress(progressRes.data || null);
    } catch {
      setError(t("programs.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const validateProgramForm = () => {
    const nextErrors = {};
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const durationValue = Number(duration);

    if (trimmedName.length < 3) {
      nextErrors.name = t("programs.nameMinError");
    } else if (trimmedName.length > 60) {
      nextErrors.name = t("programs.nameMaxError");
    }

    if (!Number.isFinite(durationValue) || durationValue < 1 || durationValue > 52) {
      nextErrors.duration = t("programs.durationRangeError");
    }

    if (trimmedDescription.length > 280) {
      nextErrors.description = t("programs.descriptionMaxError");
    }

    // Collect all field errors at once so user can fix everything in one pass.
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreateProgram = async (event) => {
    event.preventDefault();
    if (!validateProgramForm()) {
      return;
    }

    try {
      setError("");
      setSaving(true);

      await createProgram({
        name: name.trim(),
        description: description.trim(),
        duration: Number(duration),
        difficulty,
        phases: []
      });

      setName("");
      setDescription("");
      setDuration("8");
      setDifficulty("intermediate");
      setFieldErrors({});

      await loadData();
    } catch {
      setError(t("programs.createError"));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProgram = async (programId) => {
    try {
      setError("");
      await deleteProgram(programId);
      setPrograms((prev) => prev.filter((item) => item._id !== programId));
    } catch {
      setError(t("programs.deleteError"));
    }
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">{t("programs.title")}</Typography>
            <Typography color="text.secondary">
              {t("programs.subtitle")}
            </Typography>

            <Box component="form" onSubmit={handleCreateProgram}>
              <Stack spacing={1.5}>
                <TextField
                  label={t("programs.name")}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) {
                      setFieldErrors((prev) => ({ ...prev, name: "" }));
                    }
                  }}
                  required
                  fullWidth
                  error={Boolean(fieldErrors.name)}
                  helperText={fieldErrors.name}
                />
                <TextField
                  label={t("programs.description")}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (fieldErrors.description) {
                      setFieldErrors((prev) => ({ ...prev, description: "" }));
                    }
                  }}
                  multiline
                  minRows={2}
                  fullWidth
                  error={Boolean(fieldErrors.description)}
                  helperText={fieldErrors.description || `${description.trim().length}/280`}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <TextField
                    label={t("programs.duration")}
                    type="number"
                    value={duration}
                    onChange={(e) => {
                      setDuration(e.target.value);
                      if (fieldErrors.duration) {
                        setFieldErrors((prev) => ({ ...prev, duration: "" }));
                      }
                    }}
                    required
                    inputProps={{ min: 1, max: 52 }}
                    fullWidth
                    error={Boolean(fieldErrors.duration)}
                    helperText={fieldErrors.duration}
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
                <Box>
                  <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? t("programs.creating") : t("programs.create")}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t("programs.library")}
              </Typography>

              {programs.length === 0 ? (
                <Typography color="text.secondary">{t("programs.empty")}</Typography>
              ) : (
                <Stack spacing={1.2}>
                  {programs.map((program) => (
                    <Stack
                      key={program._id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 2,
                        px: 1.5,
                        py: 1,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: "rgba(0,194,168,0.08)",
                          borderColor: "rgba(0,194,168,0.3)"
                        }
                      }}
                    >
                      <Box onClick={() => navigate(`/programs/${program._id}`)} sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600 }}>{program.name}</Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                          <Chip size="small" label={`${program.duration} ${t("programs.weeksLabel")}`} />
                          <Chip size="small" label={t(`programs.levels.${program.difficulty}`)} variant="outlined" />
                        </Stack>
                      </Box>
                      <IconButton color="error" onClick={() => handleDeleteProgram(program._id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={0.5} sx={{ mb: 2 }}>
                <Typography variant="h6">{t("programs.progressInsights")}</Typography>
                <Typography color="text.secondary">
                  {t("programs.totalImprovement")}: {progress?.totalImprovementKg ?? 0} kg | {t("programs.sessions")}: {progress?.workoutsCount ?? 0}
                </Typography>
              </Stack>

              {chartData.length === 0 ? (
                <Typography color="text.secondary">
                  {t("programs.noChart")}
                </Typography>
              ) : (
                <Box sx={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 12, right: 12, left: 4, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="exercise" angle={-20} textAnchor="end" height={70} interval={0} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="improvement" fill="#00c2a8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Stack>
  );
}

export default UserProgramCenter;
