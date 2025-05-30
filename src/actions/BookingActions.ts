import api from "./api";
export const generateRazorpayOrderId =  async (paymentRequestObject: any) => {
    try {
        const response = await api.post("/booking-service/api/create-order", paymentRequestObject);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error generating Razorpay Order ID");
    }
}

export const verifyPayment = async (paymentVerificationObject: any) => {
    try {
        const response = await api.post("/payment-service/api/verify", paymentVerificationObject);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error verifying payment");
    }
}

export const createBooking = async (bookingRequestObject: any) => {
    try {
        const response = await api.post("/booking-service/api/booking", bookingRequestObject);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error creating booking");
    }
}

export const getBookingByUserId = async (userId: number) => {
    try {
        const response = await api.get(`/booking-service/api/bookings/user/${userId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error fetching bookings");
    }
}

export const getAllBookings = async (setLoading:any) => {
    setLoading(true);
    try {
        const response = await api.get("/booking-service/api/bookings");
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error fetching all bookings");
    }
}

export const deletBookingById = async (bookingId: number) => {
    try {
        const response = await api.delete(`/booking-service/api/booking/${bookingId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error deleting booking");
    }
}