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
export const createProgram = (payload) => apiClient.post("/programs", payload);
export const deleteProgram = (programId) => apiClient.delete(`/programs/${programId}`);
