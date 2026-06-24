import api from "./api";

export const updateUser = async (username: string, email: string) => {
  const userData = { username, email };
  const response = await api.put("/user/update", userData);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete(`/user/delete`);
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

export const sendEmailOtp = async (email: string) => {
  const response = await api.post("/mail/send-otp", { email });
  return response.data;
};

export const verifyEmailOtp = async (email: string, otp: string) => {
  const response = await api.post("/mail/verify-otp", { email, otp });
  return response.data;
};

export const changeProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await api.put("/user/profile-pic", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
