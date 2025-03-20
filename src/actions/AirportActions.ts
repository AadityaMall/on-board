export async function createAirportAction(formData: FormData) {
  const data = {
    airportName: formData.get("airportName"),
    city: formData.get("city"),
    country: "IN",
  };
  const response = await fetch("http://localhost:8080/airport-service/api/airport", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Airport Creation failed");
  }

  return { success: true, data: responseData };
}

export async function fetchAirportsAction(setLoading: Function) {
  setLoading(true);
  const response = await fetch("http://localhost:8080/airport-service/api/airports");
  if (!response.ok) {
    throw new Error("Failed to fetch airports");
  }
  const responseData = await response.json();
  return { success: true, data: responseData.data, message: responseData.message };
}

export async function updateAirportAction(formData:any){

  const response = await fetch("http://localhost:8080/airport-service/api/airport", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Airport Update failed");
  }

  return { success: true, data: responseData };
}

export async function deleteAirportAction(id:number){
  try {
    // delete airport request
    const response = await fetch(`http://localhost:8080/airport-service/api/airport/${id}`, {
      method: "DELETE",
    });
    const responseData = await response.json();
    // If backend successfully deleted airport but has warnings about dependencies
    if (responseData.success) {
      return { 
        success: true, 
        data: responseData, 
        message: "Airport deleted successfully!", 
        warning: responseData.message // Include warning message from backend
      };
    }
    
    // If response is not OK but backend didn't mark success
    if (!response.ok) {
      throw new Error(responseData.message || "Something went wrong!");
    }
    
    return { success: true, data: responseData, message: "Airport deleted successfully!" };
  } catch (error) {
    console.error("Error deleting airport:", error);
    throw error;
  }
}