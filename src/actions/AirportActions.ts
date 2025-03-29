import api from "./api"; // Import the configured Axios instance

export async function createAirportAction(formData: FormData) {
  try {
    const data = {
      airportName: formData.get("airportName"),
      city: formData.get("city"),
      country: "IN",
    };

    const response = await api.post("/airport-service/api/airport", data);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Airport creation failed" };
  }
}

export async function fetchAirportsAction(setLoading: Function) {
  try {
    setLoading(true);
    const response = await api.get("/airport-service/api/airports");
    return { success: true, data: response.data.data, message: response.data.message };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Failed to fetch airports" };
  } finally {
    setLoading(false);
  }
}

export async function updateAirportAction(formData: any) {
  try {
    const response = await api.put("/airport-service/api/airport", formData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Airport update failed" };
  }
}

export async function deleteAirportAction(id: number) {
  try {
    const response = await api.delete(`/airport-service/api/airport/${id}`);
    const responseData = response.data;

    return {
      success: true,
      data: responseData,
      message: "Airport deleted successfully!",
    };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Error deleting airport" };
  }
}
