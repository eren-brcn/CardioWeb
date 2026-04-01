import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  IconButton,
  Chip,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  ListItemText,
  Checkbox
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import {
  getAllPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  assignProgramToUser,
  getAllUsers
} from "../../services/adminApi";

function ProgramManager() {
  const [programs, setPrograms] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 12,
    difficulty: "intermediate",
    phases: []
  });

  useEffect(() => {
    loadPrograms();
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await getAllUsers();
      setMembers(response.data || []);
    } catch {
      // Silent fail for members
    }
  };

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllPrograms();
      setPrograms(response.data || []);
    } catch {
      setError("Failed to load programs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.duration) {
      setError("Name and duration are required.");
      return;
    }

    try {
      setError("");
      if (editingId) {
        await updateProgram(editingId, formData);
      } else {
        await createProgram(formData);
      }
      await loadPrograms();
      setShowDialog(false);
      resetForm();
    } catch {
      setError("Failed to save program.");
    }
  };

  const handleDelete = async (programId) => {
    if (window.confirm("Delete this program?")) {
      try {
        await deleteProgram(programId);
        await loadPrograms();
      } catch {
        setError("Failed to delete program.");
      }
    }
  };

  const handleOpenAssign = (program) => {
    setSelectedProgram(program);
    setSelectedUsers(program.assignedUsers?.map((u) => u._id || u) || []);
    setShowAssignDialog(true);
  };

  const handleAssignUsers = async () => {
    if (!selectedProgram) return;

    try {
      setError("");
      for (const userId of selectedUsers) {
        if (!selectedProgram.assignedUsers?.some((u) => (u._id || u) === userId)) {
          await assignProgramToUser(selectedProgram._id, userId);
        }
      }
      await loadPrograms();
      setShowAssignDialog(false);
    } catch {
      setError("Failed to assign program.");
    }
  };

  const handleEdit = (program) => {
    setEditingId(program._id);
    setFormData({
      name: program.name,
      description: program.description,
      duration: program.duration,
      difficulty: program.difficulty,
      phases: program.phases
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: 12,
      difficulty: "intermediate",
      phases: []
    });
    setEditingId(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}

      <Button
        variant="contained"
        startIcon={<AddOutlinedIcon />}
        onClick={() => {
          resetForm();
          setShowDialog(true);
        }}
      >
        Create New Program
      </Button>

      <Typography variant="h6">Programs: {programs.length}</Typography>

      <Grid container spacing={2}>
        {programs.map((program) => (
          <Grid item xs={12} sm={6} md={4} key={program._id}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6">{program.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {program.description}
                  </Typography>
                  <Typography variant="body2">
                    Duration: <strong>{program.duration} weeks</strong>
                  </Typography>
                  <Typography variant="body2">
                    Difficulty: <strong>{program.difficulty}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Assigned to {program.assignedUsers?.length || 0} users
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, pt: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenAssign(program)}
                      title="Assign Users"
                    >
                      <PersonAddOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(program)}
                      title="Edit"
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(program._id)}
                      title="Delete"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit Program" : "Create New Program"}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Program Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Duration (weeks)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              select
              label="Difficulty"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              fullWidth
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showAssignDialog} onClose={() => setShowAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Program to Members</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {selectedProgram?.name}
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Select Members</InputLabel>
              <Select
                multiple
                value={selectedUsers}
                onChange={(e) => setSelectedUsers(e.target.value)}
                input={<OutlinedInput label="Select Members" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((val) => {
                      const user = members.find((m) => m.id === val);
                      return <Chip key={val} label={user?.name || val} />;
                    })}
                  </Box>
                )}
              >
                {members.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    <Checkbox checked={selectedUsers.includes(member.id)} />
                    <ListItemText primary={member.name} secondary={member.email} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAssignDialog(false)}>Cancel</Button>
          <Button onClick={handleAssignUsers} variant="contained">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default ProgramManager;
