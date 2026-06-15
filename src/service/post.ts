import api from "./api";

export const createPost = async (data: any) => {
  const response = await api.post("/post/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updatePost = async (id: string, data: any) => {
  const response = await api.put(`/post/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await api.delete(`/post/delete/${id}`);
  return response.data;
};

export const getAllPosts = async (page: number, limit: number) => {
  const response = await api.get(`/post/all?page=${page}&limit=${limit}`);
  return response.data;
};

export const getMyPosts = async (page: number, limit: number) => {
  const response = await api.get(`/post/my?page=${page}&limit=${limit}`);
  return response.data;
};

export const addBookmark = async (postId: string) => {
  const response = await api.post(`/post/bookmark/${postId}`);
  return response.data;
};

export const removeBookmark = async (postId: string) => {
  const response = await api.delete(`/post/bookmark/${postId}`);
  return response.data;
};

export const getBookmarkPosts = async (page: number, limit: number) => {
  const response = await api.get(`/post/bookmarks?page=${page}&limit=${limit}`);
  return response.data;
};
