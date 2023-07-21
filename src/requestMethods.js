import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

// Token parse works | Update, single parse does not, will get into inf loop with no user
//const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;

//const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YWI4ZjkzMmI5MDU4ODg0NjRlMmZkYSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY4OTc5NDY1NCwiZXhwIjoxNjkwMDUzODU0fQ.iUhzHVuW4DgNq2mBWgAbo0zCwBtXaAmta8QUbonaEjA";

// This works
const TOKEN = () => {
    if (
      JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
        .currentUser.accessToken
    ) {
      return JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
        .currentUser.accessToken;
    } else { return "" }
};


export const publicRequest = axios.create({
    baseURL: BASE_URL,
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
    headers: { token: `Bearer ${TOKEN}` },
});
