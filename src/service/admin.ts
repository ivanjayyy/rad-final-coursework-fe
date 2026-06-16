import api from "./api";

export const getDashboardStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getAllUsersAdmin = async (page: number, limit: number) => {
  const response = await api.get(
    `/admin/get-users?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const deleteUserAdmin = async (id: string) => {
  const response = await api.delete(`/admin/delete-user/${id}`);
  return response.data;
};

export const toggleBanUserAdmin = async (id: string) => {
  const response = await api.put(`/admin/ban-user/${id}/ban`);
  return response.data;
};
