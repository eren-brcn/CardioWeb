import { useState, useEffect } from "react";
import {
  Badge,
  IconButton,
  Popover,
  Stack,
  Typography,
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Switch,
  MenuItem,
  TextField
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useTranslation } from "react-i18next";
import {
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  clearAllNotifications,
  getNotificationPreferences,
  updateNotificationPreferences
} from "../services/backendApi";

function NotificationBell() {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState("weekly");

  const handleOpen = async (e) => {
    setAnchorEl(e.currentTarget);
    await loadNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Fetch list + unread counter together so badge and panel stay in sync.
      const res = await getNotifications();
      setNotifications(res.data || []);
      const countRes = await getUnreadNotificationsCount();
      setUnreadCount(countRes.data?.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const res = await getNotificationPreferences();
      setNotificationsEnabled(res.data?.notificationsEnabled !== false);
      setReminderFrequency(res.data?.reminderFrequency || "weekly");
    } catch (error) {
      console.error("Failed to load preferences", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      // Optimistic local update avoids a second list fetch after each click.
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to clear notifications", error);
    }
  };

  const handlePreferenceChange = async (newEnabled) => {
    try {
      setNotificationsEnabled(newEnabled);
      await updateNotificationPreferences({
        notificationsEnabled: newEnabled,
        reminderFrequency
      });
    } catch (error) {
      console.error("Failed to update preferences", error);
    }
  };

  const handleFrequencyChange = async (newFrequency) => {
    try {
      setReminderFrequency(newFrequency);
      await updateNotificationPreferences({
        notificationsEnabled,
        reminderFrequency: newFrequency
      });
    } catch (error) {
      console.error("Failed to update frequency", error);
    }
  };

  useEffect(() => {
    loadPreferences();
    // Keep badge fresh while user is navigating around the app.
    const interval = setInterval(async () => {
      const countRes = await getUnreadNotificationsCount();
      setUnreadCount(countRes.data?.unreadCount || 0);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Card sx={{ width: 350, maxHeight: 500 }}>
          <CardContent>
            {showPreferences ? (
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6">{t("notifications.preferences")}</Typography>
                  <Button
                    size="small"
                    onClick={() => setShowPreferences(false)}
                  >
                    {t("programDetail.cancel")}
                  </Button>
                </Box>

                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography>{t("notifications.enable")}</Typography>
                    <Switch
                      checked={notificationsEnabled}
                      onChange={(e) => handlePreferenceChange(e.target.checked)}
                    />
                  </Box>

                  {notificationsEnabled && (
                    <TextField
                      select
                      fullWidth
                      label={t("notifications.frequency")}
                      value={reminderFrequency}
                      onChange={(e) => handleFrequencyChange(e.target.value)}
                      size="small"
                    >
                      <MenuItem value="daily">{t("notifications.daily")}</MenuItem>
                      <MenuItem value="weekly">{t("notifications.weekly")}</MenuItem>
                      <MenuItem value="monthly">{t("notifications.monthly")}</MenuItem>
                    </TextField>
                  )}
                </Box>
              </Stack>
            ) : (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">{t("notifications.title")}</Typography>
                  <Button
                    size="small"
                    onClick={() => setShowPreferences(true)}
                  >
                    ⚙️
                  </Button>
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : notifications.length === 0 ? (
                  <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                    {t("notifications.empty")}
                  </Typography>
                ) : (
                  <>
                    <Stack spacing={1} sx={{ maxHeight: 350, overflowY: "auto" }}>
                      {notifications.map((notif) => (
                        <Box
                          key={notif._id}
                          sx={{
                            p: 1,
                            backgroundColor: notif.read ? "transparent" : "rgba(0,194,168,0.1)",
                            borderRadius: 1,
                            border: "1px solid rgba(255,255,255,0.08)",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            "&:hover": {
                              backgroundColor: "rgba(0,194,168,0.15)"
                            }
                          }}
                          onClick={() => {
                            if (!notif.read) {
                              handleMarkAsRead(notif._id);
                            }
                          }}
                        >
                          <Typography variant="subtitle2">{notif.title}</Typography>
                          {notif.message && (
                            <Typography variant="caption" color="text.secondary">
                              {notif.message}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                    <Button
                      fullWidth
                      size="small"
                      onClick={handleClearAll}
                      sx={{ mt: 2 }}
                    >
                      {t("notifications.clearAll")}
                    </Button>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Popover>
    </>
  );
}

export default NotificationBell;
