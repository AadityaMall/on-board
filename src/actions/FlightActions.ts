export async function createFlightAction(data: any) {

    const response = await fetch("http://localhost:8080/flight-service/api/flight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    const responseData = await response.json();
  
    if (!response.ok) {
      throw new Error(responseData.message || "Flight Creation failed");
    }
  
    return { success: true, data: responseData };
  }
  
  export async function fetchFlightAction(setLoading: Function) {
    setLoading(true);
    const response = await fetch("http://localhost:8080/flight-service/api/flights");
    if (!response.ok) {
      throw new Error("Failed to fetch airports");
    }
    const responseData = await response.json();
    return { success: true, data: responseData.data, message: responseData.message };
  }
  
  export async function updateFlightAction(formData:any){
  
    const response = await fetch("http://localhost:8080/flight-service/api/flight", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  
    const responseData = await response.json();
  
    if (!response.ok) {
      throw new Error(responseData.message || "Flight Update failed");
    }
  
    return { success: true, data: responseData };
  }
  
  export async function deleteFlightAction(id:number){
    try {
      // delete airport request
      const response = await fetch(`http://localhost:8080/flight-service/api/flight/${id}`, {
        method: "DELETE",
      });
      const responseData = await response.json();
      // If backend successfully deleted airport but has warnings about dependencies
      if (responseData.success) {
        return { 
          success: true, 
          data: responseData, 
          message: "Flight deleted successfully!", 
          warning: responseData.message // Include warning message from backend
        };
      }
      
      // If response is not OK but backend didn't mark success
      if (!response.ok) {
        throw new Error(responseData.message || "Something went wrong!");
      }
      
      return { success: true, data: responseData, message: "Flight deleted successfully!" };
    } catch (error) {
      console.error("Error deleting flight:", error);
      throw error;
    }
  }