import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ExerciseList from '../components/ExerciseList.jsx';
import WgerExerciseFeed from '../components/WgerExerciseFeed.jsx';
import UserProgramCenter from '../components/UserProgramCenter.jsx';
import NutritionTracker from '../components/NutritionTracker.jsx';
import AnalyticsDashboard from '../components/AnalyticsDashboard.jsx';
import { Alert, Button, Card, CardContent, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getCategories, getExercises } from '../services/backendApi';

function Dashboard() {
  const [importedExercise, setImportedExercise] = useState(null);
  const [recommendedCategories, setRecommendedCategories] = useState([]);
  const [recommendationError, setRecommendationError] = useState("");
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const { t } = useTranslation();

  const loadRecommendations = useCallback(async () => {
    try {
      setRecommendationError("");
      setLoadingRecommendations(true);
      const [exerciseRes, categoryRes] = await Promise.all([getExercises(), getCategories()]);
      const categories = categoryRes.data || [];
      // Count workouts per category to rank recommendations.
      const usage = (exerciseRes.data || []).reduce((acc, item) => {
        const key = String(item.category || "General");
        acc.set(key, (acc.get(key) || 0) + 1);
        return acc;
      }, new Map());

      // Keep top 3 and match them back to category records.
      const topThree = [...usage.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => categories.find((c) => c.name === name) || { name });

      setRecommendedCategories(topThree);
    } catch {
      setRecommendedCategories([]);
      setRecommendationError(t("dashboard.recommendedLoadError"));
    } finally {
      setLoadingRecommendations(false);
    }
  }, [t]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const hasRecommendations = useMemo(() => recommendedCategories.length > 0, [recommendedCategories]);

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h3" component="h1" gutterBottom>
            {t("dashboard.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("dashboard.subtitle")}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h5">{t("dashboard.recommendedTitle")}</Typography>
            <Typography color="text.secondary">{t("dashboard.recommendedSubtitle")}</Typography>

            {loadingRecommendations ? (
              <Stack direction="row" alignItems="center" spacing={1.2}>
                <CircularProgress size={18} />
                <Typography color="text.secondary">{t("dashboard.recommendedLoading")}</Typography>
              </Stack>
            ) : recommendationError ? (
              <Alert
                severity="warning"
                action={
                  <Button color="inherit" size="small" onClick={loadRecommendations}>
                    {t("dashboard.retry")}
                  </Button>
                }
              >
                {recommendationError}
              </Alert>
            ) : hasRecommendations ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {recommendedCategories.map((category) => (
                  <Button
                    key={category.name}
                    component={Link}
                    to={`/categories/${encodeURIComponent(category.name)}`}
                    variant="outlined"
                  >
                    {category.name}
                  </Button>
                ))}
              </Stack>
            ) : (
              <Chip label={t("dashboard.recommendedEmpty")} variant="outlined" color="secondary" />
            )}
          </Stack>
        </CardContent>
      </Card>

      <ExerciseList importedExercise={importedExercise} />
      <NutritionTracker />
      <AnalyticsDashboard />
      <UserProgramCenter />
      <WgerExerciseFeed onImportExercise={setImportedExercise} />
    </Stack>
  );
}

export default Dashboard;