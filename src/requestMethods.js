import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";
//const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YWI4ZjkzMmI5MDU4ODg0NjRlMmZkYSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY4ODk2NTA0NSwiZXhwIjoxNjg5MjI0MjQ1fQ.TwbhQXUpWO9JZ6uP-hiEvIg04w9zopTYiwiHnqszSvY";
/*
const TOKEN = () => {
    if (
      JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
        .currentUser.accessToken
    ) {
      return JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
        .currentUser.accessToken;
    } else { return "" }
};
*/
export const publicRequest = axios.create({
    baseURL: BASE_URL,
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
    header:{token:`Bearer ${TOKEN}` },
});
