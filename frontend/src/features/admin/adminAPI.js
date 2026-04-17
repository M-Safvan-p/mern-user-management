import api from "../../services/api";

export const getUsersAPI = async () => {
  const res = await api.get("/admin/users");
  return res;
};

export const deleteUserAPI = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res;
};

export const createUserAPI = async (data) => {
  const res = await api.post(`/admin/user`, data);
  return res;
};

export const updateUserAPI = async (id, data) => {
  const res = await api.put(`/admin/users/${id}`, data);
  return res;
};
