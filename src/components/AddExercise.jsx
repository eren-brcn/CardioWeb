import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addExercise } from "../services/backendApi";
import { useTranslation } from "react-i18next";

const baseCategories = ["Chest", "Back", "Legs", "Cardio", "Yoga"];

const mapWgerCategoryToLocal = (categoryName) => {
  const value = String(categoryName || "").toLowerCase();

  if (/chest|pector/i.test(value)) {
    return "Chest";
  }
  if (/back|lats|latissimus|trap|trapezius/i.test(value)) {
    return "Back";
  }
  if (/leg|glute|quad|hamstring|calf/i.test(value)) {
    return "Legs";
  }
  if (/cardio|heart|hiit|aerobic|endurance/i.test(value)) {
    return "Cardio";
  }
  if (/yoga|mobility|stretch|flexibility/i.test(value)) {
    return "Yoga";
  }

  return "Cardio";
};

const getImportedName = (exercise) => {
  const translations = exercise?.translations || [];
  const english = translations.find((t) => t.language === 2);
  return english?.name || translations[0]?.name || "";
};

function AddExercise({ onExerciseAdded, importedExercise }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Chest");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  const categories = useMemo(() => {
    const importedCategory = importedExercise?.category?.name;
    if (importedCategory && !baseCategories.includes(importedCategory)) {
      return [...baseCategories, importedCategory];
    }
    return baseCategories;
  }, [importedExercise]);

  useEffect(() => {
    if (!importedExercise) {
      return;
    }

    setTitle(getImportedName(importedExercise));
    setCategory(mapWgerCategoryToLocal(importedExercise.category?.name));

    setWeight((prev) => prev || "20");
  }, [importedExercise]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const newExercise = {
      title,
      category,
      currentWeight: Number(weight),
      // Generates a unique string ID for the database
      id: Date.now().toString() 
    };

    try {
      await addExercise(newExercise);
      
      // Reset form fields
      setTitle("");
      setWeight("");
      
      // Trigger the refresh in the parent component
      onExerciseAdded(); 
    } catch {
      setError(t("exercise.addError"));
    }
  };

  return (
    <Card>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <Typography variant="h5">{t("exercise.addTitle")}</Typography>

            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <TextField
                label={t("exercise.name")}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                fullWidth
                required
              />
              <TextField
                label={t("exercise.weight")}
                type="number"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                required
                sx={{ minWidth: { md: 160 } }}
              />
              <TextField
                select
                label={t("exercise.category")}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                sx={{ minWidth: { md: 180 } }}
              >
                {categories.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Box>
              <Button type="submit" variant="contained" startIcon={<AddCircleOutlineIcon />}>
                {t("exercise.addButton")}
              </Button>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AddExercise;