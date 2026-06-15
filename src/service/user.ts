import api from "./api";

export const updateUser = async (username: string, email: string, location: string) => {
  const response = await api.put("/user/update", { username, email, location });
  return response.data;
};

export const deleteUser = async () => {
  const response = await api.delete("/user/delete");
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/user/all");
  return response.data;
};

export const sendEmailOtp = async (email: string) => {
  const response = await api.post("/user/otp", { email });
  return response.data;
};

export const verifyEmailOtp = async (email: string, otp: string) => {
  const response = await api.post("/user/otp/verify", { email, otp });
  return response.data;
};
