import api from "./api";

export const createPost = async (title: string, description: string, tags: string[]) => {
    const response = await api.post("/post/create", { title, description, tags });
    return response.data;
};

export const getAllPosts = async () => {
    const response = await api.get("/post/all");
    return response.data;
};

export const getMyPosts = async () => {
    const response = await api.get("/post/my");
    return response.data;
};