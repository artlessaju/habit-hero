import axios from 'axios';

// The URL of your Python Backend
const BASE_URL = "http://localhost:8000";

// 1. REGISTER API
export const registerAPI = async (user) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, user);
    return response;
  } catch (error) {
    return error.response; // Returns the error message from Python
  }
};

// 2. LOGIN API
export const loginAPI = async (user) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, user);
    return response;
  } catch (error) {
    return error.response;
  }
};

// 3. ADD HABIT API
export const addHabitAPI = async (habit, userId) => {
  try {
    // Note: We send userId as a query parameter for simplicity
    const response = await axios.post(`${BASE_URL}/habits?user_id=${userId}`, habit);
    return response;
  } catch (error) {
    return error.response;
  }
};

// 4. GET HABITS API
export const getHabitsAPI = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/habits/${userId}`);
    return response;
  } catch (error) {
    return error.response;
  }
};

// 5. DELETE HABIT API
export const deleteHabitAPI = async (habitId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/habits/${habitId}`);
    return response;
  } catch (error) {
    return error.response;
  }
};

// 6. LOG HABIT API (Save progress & Get AI Sentiment)
export const logHabitAPI = async (habitId, logData) => {
  try {
    const response = await axios.post(`${BASE_URL}/habits/${habitId}/log`, logData);
    return response;
  } catch (error) {
    return error.response;
  }
};