import api from "./api";

//Get all schedules
export const getAllSchedules = async (setLoading:any) => {
  setLoading(true);
  try {
    const response = await api.get("/schedule-service/api/all-schedules");
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.message || "Error fetching schedules");
  }
};

//Create schedule
export const createScheduleAction = async (data:any) => {
  try {
    const response = await api.post("/schedule-service/api/schedule", data);
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.message || "Error creating schedule");
  }
}

//Delete Schedule 
export const deleteScheduleAction = async (id:string) => {
  try {
    const response = await api.delete(`/schedule-service/api/schedule/${id}`);
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.message || "Error deleting schedule");
  }
}

//Update schedule
export const updateScheduleAction = async (data:any) => {
  try {
    console.log(data);
    const response = await api.put("/schedule-service/api/schedule", data);
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.message || "Error updating schedule");
  }
}

//Get schedule by id
export const getScheduleById = async (id:string) => {
  try {
    const response = await api.get(`/schedule-service/api/schedule/${id}`);
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.message || "Error fetching schedule by id");
  }
}

//Get schedules by date range only
export const getSchedulesByDateRange = async (startUtc: string, endUtc: string, setLoading?: any) => {
  if (setLoading) setLoading(true);
  try {
    let url = `/schedule-service/api/schedules?start=${startUtc}&end=${endUtc}`;
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching schedules by date range");
  } finally {
    if (setLoading) setLoading(false);
  }
};