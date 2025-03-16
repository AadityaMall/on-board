
export async function createAirportAction(formData: FormData) {
  const data = {
    airportName: formData.get("airportName"),
    city: formData.get("city"),
    country: formData.get("country"),
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
    throw new Error(responseData.message || "Registration failed");
  }

  return { success: true, data: responseData };
}

