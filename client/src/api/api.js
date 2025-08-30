import axios from "axios"
import { getToken } from "../context/UserContext.js"
const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_URL,
});
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    // console.log("Token from interceptor:", token); // Debugging line
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// User context api
export const loginApi = async (email, password) => {
  return api.post("/auth/login", { email, password });
}
 export const meApi = async () => {
  return api.get("/auth/me");
}

// signup api
export const signupApi = async (username, password, email, name) => {
  return api.post("/auth/register", { username, password, email, name });
}
// chats api
// fetch messages
export const fetchMessagesApi = async (username,person) => {
    // console.log(username)    
    // console.log(person)
  return api.get(`/messages/${username}/${person}`);
}
// delte account
export const deleteAccountApi = async () => {
  return api.delete(`/auth/delete`);
}
// fetch all users except current user
export const fetchAllUsersApi = async () => {
  return api.get("/auth/allChatusers");
}
// search users
export const searchUsersApi = async (username) => {
  return api.get(`/auth/search/${username}`);
}
// update profile
export const updateProfileApi = async (formData) => {
  console.log(formData)
  return api.put("/auth/update", formData);
}
// delete chat
export const deleteChatApi = async (from, to) => {
  console.log(from,to)  
  return api.delete(`/deleteChat/${from}/${to}`);
}
// delete message
export const deleteMessageApi = async (messageId,text) => {
  return api.delete(`/messages/${messageId}`,{
  text:text
  });
}
export const updateMessageApi = async (messageId, data) => {
  console.log(messageId, data); 
  return api.put(`/messages/${messageId}`, data);
}

export default api;