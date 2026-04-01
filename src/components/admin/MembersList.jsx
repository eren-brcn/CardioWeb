import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { getAllUsers, getUserProgress } from "../../services/adminApi";
import ProgressCharts from "./ProgressCharts";

function MembersList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberProgress, setMemberProgress] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllUsers();
      setMembers(response.data || []);
    } catch {
      setError("Failed to load members.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProgress = async (member) => {
    try {
      setSelectedMember(member);
      const response = await getUserProgress(member.id);
      setMemberProgress(response.data);
      setShowDetails(true);
    } catch {
      setError("Failed to load member progress.");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}

      <Typography variant="h6">Total Members: {members.length}</Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(0,194,168,0.08)" }}>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Workouts</TableCell>
              <TableCell align="right">Total Improvement</TableCell>
              <TableCell align="right">Last Workout</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} hover>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell align="right">{member.workoutsCount}</TableCell>
                <TableCell align="right">{member.totalImprovementKg} kg</TableCell>
                <TableCell align="right">
                  {member.lastWorkoutAt
                    ? new Date(member.lastWorkoutAt).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    startIcon={<VisibilityOutlinedIcon />}
                    onClick={() => handleViewProgress(member)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedMember?.name} - Progress Details
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {memberProgress && <ProgressCharts data={memberProgress} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default MembersList;
