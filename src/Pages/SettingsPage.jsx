import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { useTranslation } from "react-i18next";
import { clearAuthSession } from "../services/authStorage";
import { deleteMyAccount, exportMyAccount } from "../services/backendApi";

function SettingsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const deleteKeyword = t("settings.deleteKeyword");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [deleted, setDeleted] = useState(false);

  const handleExport = async () => {
    try {
      setError("");
      setMessage("");
      setBusy(true);

      const response = await exportMyAccount();
      // Client-side export keeps backend response untouched.
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "cardioweb-account-export.json";
      anchor.click();
      URL.revokeObjectURL(url);

      setMessage(t("settings.exportDone"));
    } catch {
      setError(t("settings.exportError"));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    try {
      setError("");
      setMessage("");
      setBusy(true);
      await deleteMyAccount();
      clearAuthSession();
      setDeleted(true);
      setDeleteDialogOpen(false);
    } catch {
      setError(t("settings.deleteError"));
    } finally {
      setBusy(false);
    }
  };

  const openDeleteDialog = () => {
    setDeleteConfirmInput("");
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (!busy) {
      setDeleteDialogOpen(false);
    }
  };

  if (deleted) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Alert severity="success">{t("settings.deletedTitle")}</Alert>
            <Typography color="text.secondary">{t("settings.deletedBody")}</Typography>
            <Box>
              <Button variant="contained" onClick={() => navigate("/signup", { replace: true })}>
                {t("settings.deletedCta")}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom>
          {t("settings.title")}
        </Typography>
        <Typography color="text.secondary">
          {t("settings.subtitle")}
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">{t("settings.exportTitle")}</Typography>
            <Typography color="text.secondary">{t("settings.exportDesc")}</Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<DownloadOutlinedIcon />}
                onClick={handleExport}
                disabled={busy}
              >
                {t("settings.exportButton")}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" color="error.main">
              {t("settings.deleteTitle")}
            </Typography>
            <Typography color="text.secondary">{t("settings.deleteDesc")}</Typography>
            <Box>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteForeverOutlinedIcon />}
                onClick={openDeleteDialog}
                disabled={busy}
              >
                {t("settings.deleteButton")}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t("settings.deleteDialogTitle")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <Typography color="text.secondary">{t("settings.deleteDialogBody")}</Typography>
            <Typography sx={{ fontWeight: 700 }}>{t("settings.deleteConfirmHint", { keyword: deleteKeyword })}</Typography>
            <TextField
              label={t("settings.deleteConfirmLabel")}
              value={deleteConfirmInput}
              onChange={(event) => setDeleteConfirmInput(event.target.value)}
              fullWidth
              autoFocus
              placeholder={deleteKeyword}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={busy}>
            {t("settings.cancel")}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            // Require explicit confirmation keyword before destructive action.
            disabled={busy || deleteConfirmInput.trim().toUpperCase() !== deleteKeyword.toUpperCase()}
          >
            {t("settings.confirmDelete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default SettingsPage;
