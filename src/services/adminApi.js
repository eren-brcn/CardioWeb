import apiClient from "./apiClient";

export const getAllUsers = () => apiClient.get("/admin/users");

export const getUserProgress = (userId) => apiClient.get(`/admin/users/${userId}/progress`);

export const getAllPrograms = () => apiClient.get("/programs");

export const getProgramDetail = (programId) => apiClient.get(`/programs/${programId}`);

export const createProgram = (payload) => apiClient.post("/admin/programs", payload);

export const updateProgram = (programId, payload) => apiClient.put(`/programs/${programId}`, payload);

export const deleteProgram = (programId) => apiClient.delete(`/programs/${programId}`);

export const assignProgramToUser = (programId, userId) =>
  apiClient.post(`/programs/${programId}/assign`, { userId });
