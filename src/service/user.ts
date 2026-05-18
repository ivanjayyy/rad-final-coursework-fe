import api from "./api";

export const updateUser = async (
  id: string,
  username: string,
  email: string,
) => {
  const response = await api.put(`/user/update/${id}`, { username, email });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/user/delete/${id}`);
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
