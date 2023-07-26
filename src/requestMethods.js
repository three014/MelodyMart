import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YWI4ZjkzMmI5MDU4ODg0NjRlMmZkYSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY4OTkwNDMzMCwiZXhwIjoxNjkwMTYzNTMwfQ.Us8uPDmsqOAvjl7RFwc1LMKAzZ_1iWvkZtsbP6MgH8Q";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});