import apiClient from "./apiClient";

export const getExercises = () => apiClient.get("/exercises");
export const addExercise = (payload) => apiClient.post("/exercises", payload);
export const deleteExercise = (id) => apiClient.delete(`/exercises/${id}`);
export const getCategories = () => apiClient.get("/categories");

export const addMyWorkout = (payload) => apiClient.post("/users/me/workouts", payload);
export const getMyWorkouts = () => apiClient.get("/users/me/workouts");
export const getMyProgress = () => apiClient.get("/users/me/progress");
export const exportMyAccount = () => apiClient.get("/users/me/export");
export const deleteMyAccount = () => apiClient.delete("/users/me");

export const getMyPrograms = () => apiClient.get("/programs");
export const getProgram = (programId) => apiClient.get(`/programs/${programId}`);
export const createProgram = (payload) => apiClient.post("/programs", payload);
export const updateProgram = (programId, payload) => apiClient.put(`/programs/${programId}`, payload);
export const deleteProgram = (programId) => apiClient.delete(`/programs/${programId}`);

export const getNotifications = () => apiClient.get("/notifications");
export const getUnreadNotificationsCount = () => apiClient.get("/notifications/unread-count");
export const markNotificationAsRead = (notificationId) => apiClient.put(`/notifications/${notificationId}/read`);
export const clearAllNotifications = () => apiClient.delete("/notifications");
export const getNotificationPreferences = () => apiClient.get("/notifications/preferences");
export const updateNotificationPreferences = (payload) => apiClient.put("/notifications/preferences", payload);

export const addMeal = (payload) => apiClient.post("/nutrition/meals", payload);
export const getMeals = (params) => apiClient.get("/nutrition/meals", { params });
export const getMealsSummary = (days) => apiClient.get("/nutrition/meals/summary", { params: { days } });
export const updateMeal = (mealId, payload) => apiClient.put(`/nutrition/meals/${mealId}`, payload);
export const deleteMeal = (mealId) => apiClient.delete(`/nutrition/meals/${mealId}`);

export const getUserProfile = (userId) => apiClient.get(`/social/${userId}`);
export const getMyFollowingIds = () => apiClient.get("/social/me/following-ids");
export const followUser = (userId) => apiClient.post(`/social/${userId}/follow`);
export const unfollowUser = (userId) => apiClient.post(`/social/${userId}/unfollow`);
export const getFollowing = (userId) => apiClient.get(`/social/${userId}/following`);
export const getFollowers = (userId) => apiClient.get(`/social/${userId}/followers`);
export const getLeaderboardByWeight = () => apiClient.get("/social/leaderboard/weight");
export const getLeaderboardByWorkouts = () => apiClient.get("/social/leaderboard/workouts");
export const updateUserProfile = (payload) => apiClient.put("/social/me/profile", payload);

export const addMeasurement = (payload) => apiClient.post("/analytics/measurements", payload);
export const getMeasurements = () => apiClient.get("/analytics/measurements");
export const deleteMeasurement = (measurementId) => apiClient.delete(`/analytics/measurements/${measurementId}`);
export const addGoal = (payload) => apiClient.post("/analytics/goals", payload);
export const getGoals = () => apiClient.get("/analytics/goals");
export const updateGoal = (goalId, payload) => apiClient.put(`/analytics/goals/${goalId}`, payload);
export const deleteGoal = (goalId) => apiClient.delete(`/analytics/goals/${goalId}`);
export const getMonthlySummary = (month, year) => apiClient.get("/analytics/summary/monthly", { params: { month, year } });
export const getProgression = () => apiClient.get("/analytics/progression");
