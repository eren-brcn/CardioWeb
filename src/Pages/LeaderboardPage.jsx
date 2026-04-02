import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
  Button,
  Tabs,
  Tab,
  Avatar
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useTranslation } from "react-i18next";
import { getLeaderboardByWeight, getLeaderboardByWorkouts } from "../services/backendApi";

function LeaderboardPage() {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);

  useEffect(() => {
    loadLeaderboard();
  }, [tab]);

  const loadLeaderboard = async () => {
    try {
      setError("");
      setLoading(true);
      const res =
        tab === 0
          ? await getLeaderboardByWeight()
          : await getLeaderboardByWorkouts();
      setLeaderboard(res.data || []);
    } catch {
      setError(t("leaderboard.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (index) => {
    if (index === 0) return "#FFD700"; // Gold
    if (index === 1) return "#C0C0C0"; // Silver
    if (index === 2) return "#CD7F32"; // Bronze
    return "text.secondary";
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <EmojiEventsIcon fontSize="large" color="primary" />
          <Typography variant="h4">{t("leaderboard.title")}</Typography>
        </Box>
        <Typography color="text.secondary">
          {t("leaderboard.subtitle")}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} sx={{ mb: 2 }}>
            <Tab label={t("leaderboard.byWeight")} />
            <Tab label={t("leaderboard.byWorkouts")} />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : leaderboard.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              {t("leaderboard.empty")}
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {leaderboard.map((user, index) => {
                const medal = ["🥇", "🥈", "🥉"][index] || `#${index + 1}`;
                const stat = tab === 0 ? user.totalWeight : user.workoutCount;
                const unit = tab === 0 ? "kg" : "workouts";

                return (
                  <Card
                    key={user.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      backgroundColor:
                        index < 3 ? `rgba(${index === 0 ? "255,215,0" : index === 1 ? "192,192,192" : "205,127,50"}, 0.1)` : "transparent",
                      borderLeft: `4px solid ${getMedalColor(index)}`
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="h5" sx={{ minWidth: 50 }}>
                        {medal}
                      </Typography>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.followersCount} {t("leaderboard.followers")}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="h6">
                          {stat.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {unit}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}

export default LeaderboardPage;
