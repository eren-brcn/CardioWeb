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
  MenuItem,
  Stack,
  TextField,
  Typography,
  LinearProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { addMeal, deleteMeal, getMeals, getMealsSummary } from "../services/backendApi";

const mealCategories = ["breakfast", "lunch", "dinner", "snack"];
const dailyCalorieTarget = 2000;

function NutritionTracker() {
  const { t } = useTranslation();
  const [meals, setMeals] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [mealName, setMealName] = useState("");
  const [mealCategory, setMealCategory] = useState("lunch");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [notes, setNotes] = useState("");

  const totals = useMemo(() => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0)
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  const caloriePercent = Math.min((totals.calories / dailyCalorieTarget) * 100, 100);
  const macroData = [
    { name: "Protein", value: protein },
    { name: "Carbs", value: carbs },
    { name: "Fat", value: fat }
  ];

  useEffect(() => {
    loadMeals();
    loadSummary();
  }, []);

  const loadMeals = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await getMeals({ date: new Date().toISOString().split("T")[0] });
      setMeals(res.data?.meals || []);
    } catch {
      setError(t("nutrition.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const res = await getMealsSummary(7);
      setSummary(res.data || []);
    } catch (err) {
      console.error("Failed to load summary", err);
    }
  };

  const handleAddMeal = async () => {
    if (!mealName.trim() || !calories.trim()) {
      setError(t("nutrition.nameCaloriesRequired"));
      return;
    }

    try {
      setError("");
      await addMeal({
        name: mealName.trim(),
        category: mealCategory,
        calories: Number(calories),
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        notes: notes.trim(),
        mealDate: new Date().toISOString()
      });

      setMealName("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
      setNotes("");
      setOpenDialog(false);
      await loadMeals();
      await loadSummary();
    } catch {
      setError(t("nutrition.addError"));
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await deleteMeal(mealId);
      await loadMeals();
    } catch {
      setError(t("nutrition.deleteError"));
    }
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">{t("nutrition.title")}</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              variant="contained"
              size="small"
            >
              {t("nutrition.addMeal")}
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={2}>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">
                    {t("nutrition.todayCalories")}: <strong>{totals.calories}</strong> / {dailyCalorieTarget} kcal
                  </Typography>
                  <Typography variant="body2" color={caloriePercent > 100 ? "warning.main" : "success.main"}>
                    {caloriePercent.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={caloriePercent} sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box sx={{ flex: 1, p: 1.5, backgroundColor: "rgba(0,194,168,0.1)", borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">{t("nutrition.protein")}</Typography>
                  <Typography variant="h6">{totals.protein}g</Typography>
                </Box>
                <Box sx={{ flex: 1, p: 1.5, backgroundColor: "rgba(255,143,63,0.1)", borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">{t("nutrition.carbs")}</Typography>
                  <Typography variant="h6">{totals.carbs}g</Typography>
                </Box>
                <Box sx={{ flex: 1, p: 1.5, backgroundColor: "rgba(100,200,100,0.1)", borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">{t("nutrition.fat")}</Typography>
                  <Typography variant="h6">{totals.fat}g</Typography>
                </Box>
              </Stack>

              {meals.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                  {t("nutrition.noMeals")}
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {meals.map((meal) => (
                    <Card key={meal._id} variant="outlined" sx={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2">{meal.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {meal.category.charAt(0).toUpperCase() + meal.category.slice(1)} • {meal.calories} kcal
                            </Typography>
                            {meal.notes && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                                {meal.notes}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteMeal(meal._id)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>

      {summary.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>{t("nutrition.weekSummary")}</Typography>
            <Box sx={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <LineChart data={summary} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="calories" stroke="#00c2a8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t("nutrition.addMeal")}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label={t("nutrition.mealName")}
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              fullWidth
            />
            <TextField
              select
              label={t("nutrition.category")}
              value={mealCategory}
              onChange={(e) => setMealCategory(e.target.value)}
              fullWidth
            >
              {mealCategories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={t("nutrition.calories")}
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              fullWidth
              inputProps={{ min: 0 }}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={t("nutrition.protein")}
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                fullWidth
                inputProps={{ min: 0 }}
              />
              <TextField
                label={t("nutrition.carbs")}
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                fullWidth
                inputProps={{ min: 0 }}
              />
              <TextField
                label={t("nutrition.fat")}
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Stack>
            <TextField
              label={t("nutrition.notes")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t("programDetail.cancel")}</Button>
          <Button onClick={handleAddMeal} variant="contained">
            {t("nutrition.addMeal")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default NutritionTracker;
