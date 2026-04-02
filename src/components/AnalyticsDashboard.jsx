import { useEffect, useState, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import {
  addMeasurement,
  getMeasurements,
  deleteMeasurement,
  addGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  getMonthlySummary,
  getProgression
} from "../services/backendApi";

function AnalyticsDashboard() {
  const { t } = useTranslation();
  const [measurements, setMeasurements] = useState([]);
  const [goals, setGoals] = useState([]);
  const [progression, setProgression] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Measurement dialog state
  const [openMeasurementDialog, setOpenMeasurementDialog] = useState(false);
  const [measureWeight, setMeasureWeight] = useState("");
  const [measureWaist, setMeasureWaist] = useState("");
  const [measureChest, setMeasureChest] = useState("");
  const [measureArms, setMeasureArms] = useState("");
  const [measureLegs, setMeasureLegs] = useState("");
  const [measureNotes, setMeasureNotes] = useState("");

  // Goal dialog state
  const [openGoalDialog, setOpenGoalDialog] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalUnit, setGoalUnit] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");

  // Current month
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadData();
  }, [currentMonth]);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      // Pull independent datasets in parallel to keep dashboard load time reasonable.
      const [measRes, goalsRes, progRes] = await Promise.all([
        getMeasurements(),
        getGoals(),
        getProgression()
      ]);

      setMeasurements(measRes.data || []);
      setGoals(goalsRes.data || []);
      setProgression(progRes.data || []);

      const month = currentMonth.getMonth() + 1;
      const year = currentMonth.getFullYear();
      const summaryRes = await getMonthlySummary(month, year);
      setMonthlySummary(summaryRes.data);
    } catch {
      setError(t("analytics.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeasurement = async () => {
    if (!measureWeight.trim()) {
      setError(t("analytics.weightRequired"));
      return;
    }

    try {
      setError("");
      await addMeasurement({
        weight: Number(measureWeight),
        waist: Number(measureWaist) || 0,
        chest: Number(measureChest) || 0,
        arms: Number(measureArms) || 0,
        legs: Number(measureLegs) || 0,
        notes: measureNotes
      });

      setMeasureWeight("");
      setMeasureWaist("");
      setMeasureChest("");
      setMeasureArms("");
      setMeasureLegs("");
      setMeasureNotes("");
      setOpenMeasurementDialog(false);
      await loadData();
    } catch {
      setError(t("analytics.addMeasurementError"));
    }
  };

  const handleDeleteMeasurement = async (id) => {
    try {
      await deleteMeasurement(id);
      await loadData();
    } catch {
      setError(t("analytics.deleteMeasurementError"));
    }
  };

  const handleAddGoal = async () => {
    if (!goalTitle.trim() || !goalTarget.trim()) {
      setError(t("analytics.goalTitleTargetRequired"));
      return;
    }

    try {
      setError("");
      await addGoal({
        title: goalTitle,
        description: goalDescription,
        targetValue: Number(goalTarget),
        unit: goalUnit,
        deadline: goalDeadline || null
      });

      setGoalTitle("");
      setGoalDescription("");
      setGoalTarget("");
      setGoalUnit("");
      setGoalDeadline("");
      setOpenGoalDialog(false);
      await loadData();
    } catch {
      setError(t("analytics.addGoalError"));
    }
  };

  const handleUpdateGoal = async (goalId, updates) => {
    try {
      // Backend computes progress from currentValue/targetValue, so only send raw updates.
      await updateGoal(goalId, updates);
      await loadData();
    } catch {
      setError(t("analytics.updateGoalError"));
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoal(id);
      await loadData();
    } catch {
      setError(t("analytics.deleteGoalError"));
    }
  };

  const chartData = useMemo(() => {
    return measurements
      .slice()
      .reverse()
      .map((m) => ({
        date: new Date(m.date).toLocaleDateString(),
        weight: m.weight,
        waist: m.waist,
        chest: m.chest
      }));
  }, [measurements]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      {/* Body Measurements */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">{t("analytics.measurements")}</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setOpenMeasurementDialog(true)}
              size="small"
            >
              {t("analytics.addMeasurement")}
            </Button>
          </Box>

          {measurements.length === 0 ? (
            <Typography color="text.secondary">{t("analytics.noMeasurements")}</Typography>
          ) : (
            <>
              {chartData.length > 1 && (
                <Box sx={{ width: "100%", height: 250, mb: 3 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="weight" stroke="#00c2a8" strokeWidth={2} />
                      <Line type="monotone" dataKey="waist" stroke="#ff8f3f" strokeWidth={2} />
                      <Line type="monotone" dataKey="chest" stroke="#64c864" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}

              <Stack spacing={1}>
                {measurements.slice(0, 5).map((m) => (
                  <Card key={m._id} variant="outlined" sx={{ p: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">
                          {new Date(m.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Weight: {m.weight}kg {m.waist ? `| Waist: ${m.waist}cm` : ""} {m.chest ? `| Chest: ${m.chest}cm` : ""}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteMeasurement(m._id)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>
                ))}
              </Stack>
            </>
          )}
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      {monthlySummary && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t("analytics.monthlySummary")}: {monthlySummary.month}/{monthlySummary.year}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 2
              }}
            >
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("analytics.workoutsCount")}
                </Typography>
                <Typography variant="h6">{monthlySummary.workoutCount}</Typography>
              </Card>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("analytics.totalWeight")}
                </Typography>
                <Typography variant="h6">{monthlySummary.totalWeight} kg</Typography>
              </Card>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("analytics.avgSets")}
                </Typography>
                <Typography variant="h6">{monthlySummary.avgSets}</Typography>
              </Card>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("analytics.avgReps")}
                </Typography>
                <Typography variant="h6">{monthlySummary.avgReps}</Typography>
              </Card>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Goals */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">{t("analytics.goals")}</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setOpenGoalDialog(true)}
              size="small"
            >
              {t("analytics.addGoal")}
            </Button>
          </Box>

          {goals.length === 0 ? (
            <Typography color="text.secondary">{t("analytics.noGoals")}</Typography>
          ) : (
            <Stack spacing={2}>
              {goals.map((goal) => (
                <Card key={goal._id} variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle2">{goal.title}</Typography>
                        <Checkbox
                          checked={goal.completed}
                          onChange={(e) => handleUpdateGoal(goal._id, { completed: e.target.checked })}
                        />
                      </Box>
                      {goal.description && (
                        <Typography variant="caption" color="text.secondary">
                          {goal.description}
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteGoal(goal._id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </Typography>
                      <Typography variant="body2">
                        {Math.round(goal.progress)}%
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={Math.min(goal.progress, 100)} />
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <TextField
                      type="number"
                      value={goal.currentValue}
                      onChange={(e) => handleUpdateGoal(goal._id, { currentValue: Number(e.target.value) })}
                      size="small"
                      sx={{ maxWidth: 100 }}
                      inputProps={{ step: 0.1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "No deadline"}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Strength Progression */}
      {progression.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t("analytics.progression")}
            </Typography>
            <Stack spacing={1}>
              {progression.slice(0, 10).map((ex) => (
                <Box key={ex.name} sx={{ p: 1.5, backgroundColor: "rgba(0,194,168,0.05)", borderRadius: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">{ex.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {ex.maxWeight} kg
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("analytics.lastLogged")}: {new Date(ex.lastDate).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Measurement Dialog */}
      <Dialog open={openMeasurementDialog} onClose={() => setOpenMeasurementDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t("analytics.addMeasurement")}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label={t("analytics.weight")}
              type="number"
              value={measureWeight}
              onChange={(e) => setMeasureWeight(e.target.value)}
              fullWidth
              inputProps={{ step: 0.1, min: 0 }}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={t("analytics.waist")}
                type="number"
                value={measureWaist}
                onChange={(e) => setMeasureWaist(e.target.value)}
                fullWidth
                inputProps={{ step: 0.1, min: 0 }}
              />
              <TextField
                label={t("analytics.chest")}
                type="number"
                value={measureChest}
                onChange={(e) => setMeasureChest(e.target.value)}
                fullWidth
                inputProps={{ step: 0.1, min: 0 }}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={t("analytics.arms")}
                type="number"
                value={measureArms}
                onChange={(e) => setMeasureArms(e.target.value)}
                fullWidth
                inputProps={{ step: 0.1, min: 0 }}
              />
              <TextField
                label={t("analytics.legs")}
                type="number"
                value={measureLegs}
                onChange={(e) => setMeasureLegs(e.target.value)}
                fullWidth
                inputProps={{ step: 0.1, min: 0 }}
              />
            </Stack>
            <TextField
              label={t("analytics.notes")}
              value={measureNotes}
              onChange={(e) => setMeasureNotes(e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMeasurementDialog(false)}>
            {t("programDetail.cancel")}
          </Button>
          <Button onClick={handleAddMeasurement} variant="contained">
            {t("analytics.add")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Goal Dialog */}
      <Dialog open={openGoalDialog} onClose={() => setOpenGoalDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t("analytics.addGoal")}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label={t("analytics.goalTitle")}
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label={t("analytics.goalDescription")}
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={t("analytics.targetValue")}
                type="number"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                fullWidth
                inputProps={{ step: 0.1, min: 0 }}
              />
              <TextField
                label={t("analytics.unit")}
                value={goalUnit}
                onChange={(e) => setGoalUnit(e.target.value)}
                fullWidth
                placeholder="kg, reps, etc."
              />
            </Stack>
            <TextField
              label={t("analytics.deadline")}
              type="date"
              value={goalDeadline}
              onChange={(e) => setGoalDeadline(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGoalDialog(false)}>
            {t("programDetail.cancel")}
          </Button>
          <Button onClick={handleAddGoal} variant="contained">
            {t("analytics.add")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default AnalyticsDashboard;
