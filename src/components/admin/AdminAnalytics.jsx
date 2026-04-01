import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  CircularProgress
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from "recharts";
import { getAllUsers } from "../../services/adminApi";

function AdminAnalytics() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllUsers();
      setMembers(response.data || []);
    } catch {
      setError("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (members.length === 0) {
    return <Alert severity="info">No members yet.</Alert>;
  }

  const totalMembers = members.length;
  const totalWorkouts = members.reduce((sum, m) => sum + m.workoutsCount, 0);
  const totalImprovement = members.reduce((sum, m) => sum + m.totalImprovementKg, 0);
  const avgWorkoutsPerMember = (totalWorkouts / totalMembers).toFixed(1);

  const difficultyData = [
    { name: "Active", value: members.filter((m) => m.workoutsCount > 0).length },
    { name: "Idle", value: members.filter((m) => m.workoutsCount === 0).length }
  ];

  const memberProgressData = members
    .sort((a, b) => b.totalImprovementKg - a.totalImprovementKg)
    .slice(0, 10)
    .map((m) => ({
      name: m.name.substring(0, 12),
      improvement: m.totalImprovementKg,
      workouts: m.workoutsCount
    }));

  const engagementData = members
    .filter((m) => m.workoutsCount > 0)
    .map((m) => ({
      name: m.name.substring(0, 12),
      x: m.workoutsCount,
      y: m.totalImprovementKg
    }));

  const COLORS = ["#00c2a8", "#ff8f3f"];

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Members
              </Typography>
              <Typography variant="h4">{totalMembers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Workouts
              </Typography>
              <Typography variant="h4">{totalWorkouts}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Improvement
              </Typography>
              <Typography variant="h4">{totalImprovement} kg</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Avg Workouts/Member
              </Typography>
              <Typography variant="h4">{avgWorkoutsPerMember}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Member Activity Status
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top 10 Members by Improvement
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={memberProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="improvement" fill="#00c2a8" name="Improvement (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {engagementData.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Engagement: Workouts vs Improvement
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis name="Workouts" dataKey="x" type="number" />
                <YAxis name="Improvement (kg)" dataKey="y" type="number" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  name="Members"
                  data={engagementData}
                  fill="#00c2a8"
                  fillOpacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}

export default AdminAnalytics;
