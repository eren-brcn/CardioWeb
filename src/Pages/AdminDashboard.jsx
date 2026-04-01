import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
  Stack
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import { getAuthUser } from "../services/authStorage";
import MembersList from "../components/admin/MembersList";
import ProgramManager from "../components/admin/ProgramManager";
import AdminAnalytics from "../components/admin/AdminAnalytics";

function AdminDashboard() {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState(0);
  const authUser = getAuthUser();

  useEffect(() => {
    if (authUser?.role !== "admin") {
      navigate("/");
    }
  }, [authUser, navigate]);

  if (authUser?.role !== "admin") {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Alert severity="error">Access denied. Admin only.</Alert>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography color="text.secondary">
          Manage members, track progress, and create workout programs.
        </Typography>
      </Box>

      <Card>
        <Tabs
          value={tabs}
          onChange={(_e, newVal) => setTabs(newVal)}
          sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)", px: 2 }}
        >
          <Tab icon={<PeopleAltOutlinedIcon />} label="Members" iconPosition="start" />
          <Tab icon={<FitnessCenterOutlinedIcon />} label="Programs" iconPosition="start" />
          <Tab icon={<AnalyticsOutlinedIcon />} label="Analytics" iconPosition="start" />
        </Tabs>

        <CardContent>
          {tabs === 0 && <MembersList />}
          {tabs === 1 && <ProgramManager />}
          {tabs === 2 && <AdminAnalytics />}
        </CardContent>
      </Card>
    </Stack>
  );
}

export default AdminDashboard;
