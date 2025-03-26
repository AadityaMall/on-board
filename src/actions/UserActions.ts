import api from "./api";

export async function getUserByIdAction(id: number) {
  try {
    const response = await api.get(`/user-service/api/user/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Failed to fetch user" };
  }
}

export async function getAllUsers(setLoading:any){
  setLoading(true);
  try {
    const response = await api.get("/user-service/api/users");
    return { success: true, data: response.data.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Failed to fetch users" };
  }
}

export async function updateUserRoleAction(formData:any) {
  try {
    const response = await api.put(`/user-service/api/user`, formData);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to update user role" };
  }
}

export async function deleteUserAction(id: number) {
  try {
    const response = await api.delete(`/user-service/api/user/${id}`);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to delete user" };
  }
}