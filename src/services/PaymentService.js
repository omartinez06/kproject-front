import axiosInstance from "./AxiosInstance";


const PAYMENT_BASE_RESP_API_URL = 'http://localhost:9898/api/payment';

class PaymentService {
    getAllPayments() {
        return axiosInstance.get(PAYMENT_BASE_RESP_API_URL);
    }

    createPayment(payment) {
        return axiosInstance.post(PAYMENT_BASE_RESP_API_URL, payment);
    }

    getPaymentById(paymentId) {
        return axiosInstance.get(`${PAYMENT_BASE_RESP_API_URL}/${paymentId}`);
    }

    updatePayment(paymentId, payment) {
        return axiosInstance.put(`${PAYMENT_BASE_RESP_API_URL}/${paymentId}`, payment);
    }

    deletePayment(paymentId) {
        return axiosInstance.delete(`${PAYMENT_BASE_RESP_API_URL}/${paymentId}`);
    }

    getPaymentPerMonth() {
        return axiosInstance.get(`${PAYMENT_BASE_RESP_API_URL}/report`);
    }

    validatePayment(paymentId) {
        return axiosInstance.put(`${PAYMENT_BASE_RESP_API_URL}/valid/${paymentId}`);
    }

    generateAndSendRecipt(reciptId){
        return axiosInstance.post(`${PAYMENT_BASE_RESP_API_URL}/recipt`, reciptId);
    }
}

export default new PaymentService();