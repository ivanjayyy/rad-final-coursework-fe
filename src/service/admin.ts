import api from "./api";

export const deletePost = async (id: string) => {
  const response = await api.delete(`/admin/post/delete/${id}`);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/admin/user/delete/${id}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/admin/user/all");
  console.log(response.data);
  return response.data;
};

export const allUsers = async () => {
  const response = await api.get("/admin/all-users");
  return response.data;
};

export const changeRole = async (id: string, role: string) => {
  const response = await api.put(`/admin/user/${id}/role/${role}`);
  return response.data;
};

export const sendEmail = async (
  email: string,
  subject: string,
  body: string,
) => {
  const response = await api.post("/admin/send-email", {
    email,
    subject,
    body,
  });
  return response.data;
};

export const toggleBanUserAdmin = async (id: string) => {
  const response = await api.put(`/admin/ban-user/${id}/ban`);
  return response.data;
};

export const getDashboardSummary = async () => {
  const response = await api.get("/admin/dashboard-summary");
  return response.data;
};

export const getPostVelocityMetrics = async () => {
  const response = await api.get("/admin/analytics/posts-velocity");
  return response.data;
};

export const getCaseAllocations = async () => {
  const response = await api.get("/admin/analytics/case-allocations");
  return response.data;
};
