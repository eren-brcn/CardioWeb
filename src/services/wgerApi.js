import axios from "axios";
import { WGER_API_URL } from "../config/api";

export const getWgerExercises = ({ limit = 12, offset = 0, language = 2 } = {}) =>
  axios.get(`${WGER_API_URL}/exerciseinfo/`, {
    params: {
      limit,
      offset,
      language
    }
  });

export const getExerciseDetails = (exerciseId) =>
  axios.get(`${WGER_API_URL}/exercise/${exerciseId}/`);

export const getExerciseImages = (exerciseId) =>
  axios.get(`${WGER_API_URL}/exerciseimage/`, {
    params: {
      exercise: exerciseId
    }
  });

export const getExerciseDescriptions = (exerciseId, language = 2) =>
  axios.get(`${WGER_API_URL}/exercisedescription/`, {
    params: {
      exercise: exerciseId,
      language
    }
  });
