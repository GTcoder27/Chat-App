import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chat-app-1lut.onrender.com/api",
    withCredentials: true,  // to send cookies with requests
}) 


