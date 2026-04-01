import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { Box, Stack, Typography, Card, CardContent } from "@mui/material";

function ProgressCharts({ data }) {
  if (!data?.exerciseProgress) {
    return <Typography>No progress data available.</Typography>;
  }

  const exerciseData = data.exerciseProgress.map((item) => ({
    name: item.exerciseName.substring(0, 15),
    improvement: item.improvementKg,
    sessions: item.sessions,
    startWeight: item.firstWeight,
    currentWeight: item.latestWeight
  }));

  // Create timeline data - visualize progression over weeks
  const timelineChartData = [];
  for (let i = 0; i < 8; i++) {
    const point = { week: `W${i + 1}` };
    exerciseData.forEach((ex) => {
      point[ex.name] = ex.startWeight + (ex.improvement * (i + 1)) / (ex.sessions || 1);
    });
    timelineChartData.push(point);
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Total Improvement: {data.totalImprovementKg} kg
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Workouts Completed: {data.workoutsCount}
        </Typography>
      </Box>

      {exerciseData.length > 0 && (
        <>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weight Improvement by Exercise
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={exerciseData}>
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

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weight Progress Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={exerciseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="startWeight"
                    stroke="#ff8f3f"
                    name="Starting Weight"
                  />
                  <Line type="monotone" dataKey="currentWeight" stroke="#00c2a8" name="Current Weight" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progress Over Time (Timeline)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {exerciseData.slice(0, 5).map((ex, idx) => (
                    <Area
                      key={idx}
                      type="monotone"
                      dataKey={ex.name}
                      stroke={["#00c2a8", "#ff8f3f", "#00d4ff", "#ffb84d", "#e91e63"][idx]}
                      fill={["#00c2a8", "#ff8f3f", "#00d4ff", "#ffb84d", "#e91e63"][idx]}
                      fillOpacity={0.3}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Stack>
  );
}

export default ProgressCharts;
