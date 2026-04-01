import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { getMyProgress } from "../services/backendApi";
import { useTranslation } from "react-i18next";

function ProfilePage() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        setLoading(true);
        const response = await getMyProgress();
        setProgress(response.data || null);
      } catch {
        setError(t("profile.loadError"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const improvementData = useMemo(() => {
    return (progress?.exerciseProgress || []).map((item) => ({
      exercise: item.exerciseName,
      improvement: item.improvementKg,
      sessions: item.sessions
    }));
  }, [progress]);

  const volumeData = useMemo(() => {
    return (progress?.exerciseProgress || []).map((item) => ({
      exercise: item.exerciseName,
      first: item.firstWeight,
      latest: item.latestWeight
    }));
  }, [progress]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom>
          {t("profile.title")}
        </Typography>
        <Typography color="text.secondary">
          {t("profile.subtitle")}
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Card>
            <CardContent>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.2}>
                <Chip label={`${t("profile.workouts")}: ${progress?.workoutsCount ?? 0}`} color="primary" variant="outlined" />
                <Chip
                  label={`${t("profile.totalImprovement")}: ${progress?.totalImprovementKg ?? 0} kg`}
                  color="secondary"
                  variant="outlined"
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t("profile.improvementByExercise")}
              </Typography>

              {improvementData.length === 0 ? (
                <Typography color="text.secondary">{t("profile.noChart")}</Typography>
              ) : (
                <Box sx={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={improvementData} margin={{ top: 10, right: 12, left: 2, bottom: 30 }}>
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

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t("profile.firstVsLatest")}
              </Typography>

              {volumeData.length === 0 ? (
                <Typography color="text.secondary">{t("profile.noLine")}</Typography>
              ) : (
                <Box sx={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <LineChart data={volumeData} margin={{ top: 10, right: 12, left: 2, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="exercise" angle={-20} textAnchor="end" height={70} interval={0} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="first" stroke="#ff8f3f" strokeWidth={2} dot />
                      <Line type="monotone" dataKey="latest" stroke="#00c2a8" strokeWidth={2} dot />
                    </LineChart>
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

export default ProfilePage;
