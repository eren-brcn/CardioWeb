import apiClient from "./apiClient";

export const getExercises = () => apiClient.get("/exercises");
export const addExercise = (payload) => apiClient.post("/exercises", payload);
export const deleteExercise = (id) => apiClient.delete(`/exercises/${id}`);
export const getCategories = () => apiClient.get("/categories");

export const addMyWorkout = (payload) => apiClient.post("/users/me/workouts", payload);
export const getMyProgress = () => apiClient.get("/users/me/progress");

export const getMyPrograms = () => apiClient.get("/programs");
export const createProgram = (payload) => apiClient.post("/programs", payload);
export const deleteProgram = (programId) => apiClient.delete(`/programs/${programId}`);
