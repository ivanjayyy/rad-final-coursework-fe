import api from "./api";

// register
export const register = async (
  username: string,
  email: string,
  password: string,
) => {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};

// login
export const login = async (username: string, password: string) => {
  const response = await api.post("/auth/login", {
    username,
    password,
  });
  return response.data;
};

// get my details
export const getMyDetails = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// refresh token
export const refreshTokenCall = async (refreshToken: string) => {
  const response = await api.post("/auth/refresh", { refreshToken });
  return response.data;
};
