import api from "./api"; // Import Axios instance

export async function createFlightAction(data: any) {
  try {
    const response = await api.post("/flight-service/api/flight", data);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Flight creation failed" };
  }
}

export async function fetchFlightAction(setLoading: Function) {
  try {
    setLoading(true);
    const response = await api.get("/flight-service/api/flights");
    return { success: true, data: response.data.data, message: response.data.message };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Failed to fetch flights" };
  } finally {
    setLoading(false);
  }
}

export async function updateFlightAction(formData: any) {
  try {
    const response = await api.put("/flight-service/api/flight", formData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Flight update failed" };
  }
}

export async function deleteFlightAction(id: number) {
  try {
    const response = await api.delete(`/flight-service/api/flight/${id}`);
    const responseData = response.data;
    return {
      success: true,
      data: responseData,
      message: "Flight deleted successfully!",
      warning: responseData.message || null, // Preserve warning messages
    };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Error deleting flight" };
  }
}
