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
        const response = await api.post("/payment-service/api/verify-payment", paymentVerificationObject);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error verifying payment");
    }
}