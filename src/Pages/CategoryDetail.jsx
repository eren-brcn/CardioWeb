import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Tabs,
  Tab,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { getCategories, getExercises } from "../services/backendApi";
import { getWgerExercises } from "../services/wgerApi";
import ExerciseInstructions from "../components/ExerciseInstructions";
import { useTranslation } from "react-i18next";

const getExerciseName = (exercise) => {
  const translations = exercise?.translations || [];
  const english = translations.find((t) => t.language === 2);
  return english?.name || translations[0]?.name || "Unnamed exercise";
};

function CategoryDetail() {
  const { t } = useTranslation();
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const decodedCategoryName = decodeURIComponent(categoryName || "");

  const [categoryInfo, setCategoryInfo] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [wgerExercises, setWgerExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [selectedExerciseName, setSelectedExerciseName] = useState("");
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  useEffect(() => {
    const getDetailData = async () => {
      try {
        setError("");
        setLoading(true);
        const [catRes, exRes, wgerRes] = await Promise.all([
          getCategories(),
          getExercises(),
          getWgerExercises({ limit: 100, offset: 0 })
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

        // Filter Wger exercises by category name
        const wgerFiltered = (wgerRes.data?.results || []).filter(
          (ex) => ex.category?.name && 
                  String(ex.category.name).toLowerCase() === decodedCategoryName.toLowerCase()
        );
        setWgerExercises(wgerFiltered);
      } catch {
        setError(t("categoryDetail.loadError"));
      } finally {
        setLoading(false);
      }
    };

    getDetailData();
  }, [decodedCategoryName, t]);

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
        <Typography variant="h4">{t("categoryDetail.notFound")}</Typography>
        <Button component={Link} to="/categories" startIcon={<ArrowBackIcon />}>
          {t("categoryDetail.back")}
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <Button onClick={() => navigate(-1)} sx={{ alignSelf: "flex-start" }} startIcon={<ArrowBackIcon />}>
        {t("categoryDetail.back")}
      </Button>

      <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} spacing={2}>
        <Typography variant="h3" component="h1">
          {categoryInfo.name} {t("categoryDetail.guide")}
        </Typography>
        <Chip label={t("categoryDetail.linked", { count: exercises.length })} color="secondary" />
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
        <Card sx={{ borderLeft: "4px solid", borderLeftColor: "primary.main" }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AutoStoriesOutlinedIcon color="primary" />
                <Typography variant="h6">{t("categoryDetail.about")}</Typography>
              </Stack>
              <Typography color="text.secondary" sx={{ minHeight: "100px", lineHeight: 1.6 }}>
                {categoryInfo.description || t("categoryDetail.descriptionFallback")}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderLeft: "4px solid", borderLeftColor: "info.main" }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BuildCircleOutlinedIcon color="info" />
                <Typography variant="h6">{t("categoryDetail.howTo")}</Typography>
              </Stack>
              <Typography color="text.secondary" sx={{ minHeight: "100px", lineHeight: 1.6 }}>
                {categoryInfo.howTo || t("categoryDetail.howToFallback")}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderLeft: "4px solid", borderLeftColor: "success.main" }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BoltOutlinedIcon color="success" />
                <Typography variant="h6">{t("categoryDetail.benefit")}</Typography>
              </Stack>
              <Typography color="text.secondary" sx={{ minHeight: "100px", lineHeight: 1.6 }}>
                {categoryInfo.benefit || t("categoryDetail.benefitFallback")}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "primary.main"
                  }
                }}
              >
                <Tab 
                  label={t("categoryDetail.myExercises", { count: exercises.length })} 
                  icon={<FitnessCenterOutlinedIcon sx={{ mr: 1 }} />}
                  iconPosition="start"
                />
                <Tab 
                  label={t("categoryDetail.wgerLibrary", { count: wgerExercises.length })}
                  icon={<PublicOutlinedIcon sx={{ mr: 1 }} />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {activeTab === 0 && (
              <>
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
                        <Stack flex={1} spacing={0.5}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {ex.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {t("categoryDetail.addedToWorkouts")}
                          </Typography>
                        </Stack>
                        <Chip 
                          label={`${ex.currentWeight} kg`} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">
                    {t("categoryDetail.noLocalExercises")}
                  </Typography>
                )}
              </>
            )}

            {activeTab === 1 && (
              <>
                {wgerExercises.length > 0 ? (
                  <Box
                    sx={{
                      display: "grid",
                      gap: 1.5,
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, minmax(0, 1fr))"
                      }
                    }}
                  >
                    {wgerExercises.map((ex) => (
                      <Card
                        key={ex.id}
                        sx={{
                          border: "1px solid rgba(255,255,255,0.12)",
                          backgroundColor: "rgba(255,255,255,0.03)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.06)",
                            borderColor: "rgba(255,255,255,0.2)"
                          }
                        }}
                      >
                        <CardContent sx={{ pb: 1.5 }}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, minHeight: "2.4em" }}>
                              {getExerciseName(ex)}
                            </Typography>
                            
                            {ex.description && (
                              <Typography variant="caption" color="text.secondary">
                                {ex.description.substring(0, 100)}...
                              </Typography>
                            )}
                            
                            <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap", gap: 0.8 }}>
                              {ex.equipment && (
                                <Chip 
                                  label={ex.equipment.name || t("wger.equipment")} 
                                  size="small" 
                                  variant="outlined"
                                />
                              )}
                              {ex.muscles && ex.muscles.length > 0 && (
                                <Chip 
                                  label={ex.muscles[0]?.name || t("wger.muscle")} 
                                  size="small" 
                                  variant="outlined"
                                />
                              )}
                            </Stack>

                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<SchoolOutlinedIcon />}
                                onClick={() => {
                                  setSelectedExerciseId(ex.id);
                                  setSelectedExerciseName(getExerciseName(ex));
                                  setInstructionsOpen(true);
                                }}
                                sx={{ flex: 1 }}
                              >
                                {t("wger.guide")}
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    {t("categoryDetail.noWgerExercises")}
                  </Typography>
                )}
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      <ExerciseInstructions
        open={instructionsOpen}
        exerciseId={selectedExerciseId}
        exerciseName={selectedExerciseName}
        onClose={() => setInstructionsOpen(false)}
      />
    </Stack>
  );
}

export default CategoryDetail;