import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

export const uploadFiles = async (formData) => {
  try {
    const res = await API.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Upload failed" };
  }
};