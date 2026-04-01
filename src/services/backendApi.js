import apiClient from "./apiClient";

export const getExercises = () => apiClient.get("/exercises");
export const addExercise = (payload) => apiClient.post("/exercises", payload);
export const deleteExercise = (id) => apiClient.delete(`/exercises/${id}`);
export const getCategories = () => apiClient.get("/categories");
