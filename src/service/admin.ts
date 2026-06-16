import api from "./api";

export const getDashboardStats = async () => {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
}

export const getAllUsersAdmin = async (page: number, limit: number, search: string) => {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
}

export const deleteUserAdmin = async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
}

export const toggleBanUserAdmin = async (id: string) => {
    const response = await api.put(`/admin/users/${id}/ban`);
    return response.data;
}