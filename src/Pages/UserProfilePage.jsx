import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useTranslation } from "react-i18next";
import { getMyFollowingIds, getUserProfile, followUser, unfollowUser, updateUserProfile } from "../services/backendApi";
import { getUserId } from "../services/authStorage";

function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const myUserId = getUserId();
  const isOwnProfile = userId === myUserId;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await getUserProfile(userId);
      setUser(res.data);
      setEditBio(res.data.bio || "");
      setIsPublic(res.data.isPublic !== false);

      // Load follow state from backend so button is accurate on first render.
      if (!isOwnProfile) {
        const followRes = await getMyFollowingIds();
        const ids = followRes.data?.followingIds || [];
        setIsFollowing(ids.includes(String(userId)));
      }
    } catch {
      setError(t("userProfile.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await followUser(userId);
      setIsFollowing(true);
      setUser((prev) => ({
        ...prev,
        stats: { ...prev.stats, followersCount: prev.stats.followersCount + 1 }
      }));
    } catch {
      setError(t("userProfile.followError"));
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(userId);
      setIsFollowing(false);
      setUser((prev) => ({
        ...prev,
        stats: { ...prev.stats, followersCount: prev.stats.followersCount - 1 }
      }));
    } catch {
      setError(t("userProfile.unfollowError"));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setError("");
      const res = await updateUserProfile({
        bio: editBio,
        isPublic
      });
      setUser((prev) => ({
        ...prev,
        bio: res.data.bio,
        isPublic: res.data.isPublic
      }));
      setEditDialogOpen(false);
    } catch {
      setError(t("userProfile.saveError"));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Stack spacing={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ width: "fit-content" }}
        >
          {t("userProfile.back")}
        </Button>
        <Alert severity="error">{error || t("userProfile.notFound")}</Alert>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ minWidth: "fit-content" }}
        />
        <Typography variant="h4">{user.name}</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "primary.main",
                  fontSize: "2.5rem"
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{user.name}</Typography>
                {user.bio && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                    {user.bio}
                  </Typography>
                )}

                {isOwnProfile ? (
                  <Button
                    onClick={() => setEditDialogOpen(true)}
                    variant="outlined"
                    size="small"
                  >
                    {t("userProfile.editProfile")}
                  </Button>
                ) : (
                  <Button
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                    variant={isFollowing ? "outlined" : "contained"}
                    startIcon={isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
                    size="small"
                  >
                    {isFollowing ? t("userProfile.unfollow") : t("userProfile.follow")}
                  </Button>
                )}
              </Box>
            </Box>

            {/* Stats Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 2
              }}
            >
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("userProfile.totalWeight")}
                </Typography>
                <Typography variant="h6">{user.stats.totalWeight} kg</Typography>
              </Card>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("userProfile.workouts")}
                </Typography>
                <Typography variant="h6">{user.stats.workoutCount}</Typography>
              </Card>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("userProfile.followers")}
                </Typography>
                <Typography variant="h6">{user.stats.followersCount}</Typography>
              </Card>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("userProfile.completedGoals")}
                </Typography>
                <Typography variant="h6">{user.stats.completedGoals}</Typography>
              </Card>
            </Box>

            <Box sx={{ pt: 2, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <Typography variant="body2" color="text.secondary">
                {t("userProfile.joinedOn")}: {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t("userProfile.editProfile")}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label={t("userProfile.bio")}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value.slice(0, 200))}
              multiline
              minRows={3}
              fullWidth
              helperText={`${editBio.length}/200`}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography>{t("userProfile.publicProfile")}</Typography>
              <Button
                variant={isPublic ? "contained" : "outlined"}
                onClick={() => setIsPublic(!isPublic)}
                size="small"
              >
                {isPublic ? t("userProfile.public") : t("userProfile.private")}
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <Box sx={{ p: 2, display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button onClick={() => setEditDialogOpen(false)}>
            {t("programDetail.cancel")}
          </Button>
          <Button onClick={handleSaveProfile} variant="contained">
            {t("programDetail.save")}
          </Button>
        </Box>
      </Dialog>
    </Stack>
  );
}

export default UserProfilePage;
