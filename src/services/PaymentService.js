import axios from 'axios'

const PAYMENT_BASE_RESP_API_URL = 'http://localhost:9898/api/payment';

class PaymentService {
    getAllPayments() {
        return axios.get(PAYMENT_BASE_RESP_API_URL);
    }

    createPayment(payment) {
        return axios.post(PAYMENT_BASE_RESP_API_URL, payment);
    }

    getPaymentById(paymentId) {
        return axios.get(`${PAYMENT_BASE_RESP_API_URL}/${paymentId}`);
    }

    updatePayment(paymentId, payment) {
        return axios.put(`${PAYMENT_BASE_RESP_API_URL}/${paymentId}`, payment);
    }

    deletePayment(paymentId) {
        return axios.delete(`${PAYMENT_BASE_RESP_API_URL}/${paymentId}`);
    }
}

export default new PaymentService();