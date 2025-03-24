import api from "./api";

export async function getUserByIdAction(id: number) {
  try {
    const response = await api.get(`/user-service/api/user/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Failed to fetch user" };
  }
}