import api from "./api";
//Fetch Airport Service Status
export const fetchAirportServiceHealthStatus = async () => {
    try {
        const response = await api.get("/airport-service/actuator/health");
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error fetching airport service status");
    }
}

//Fetch Schedule Service Status
export const fetchScheduleServiceHealthStatus = async () => {
    try {
        const response = await api.get("/schedule-service/actuator/health");
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error fetching schedule service status");
    }
}
//Fetch Flight Service Status
export const fetchFlightServiceHealthStatus = async () => {
    try {
        const response = await api.get("/flight-service/actuator/health");
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error fetching flight service status");
    }
}
//Fetch User Service Status
export const fetchUserServiceHealthStatus = async () => {
    try {
        const response = await api.get("/user-service/actuator/health");
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error fetching user service status");
    }
}
//Fetch Auth Service Status
export const fetchAuthServiceHealthStatus = async () => {
    try {
        const response = await api.get("/auth-service/actuator/health");
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error fetching auth service status");
    }
}