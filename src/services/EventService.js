import axiosInstance from "./AxiosInstance";

const EVENT_BASE_RESP_API_URL = 'http://localhost:9898/api/event';

class EventService {
    getAllEvents() {
        return axiosInstance.get(EVENT_BASE_RESP_API_URL);
    }

    createEvent(event) {
        return axiosInstance.post(EVENT_BASE_RESP_API_URL, event);
    }

    getEventById(eventId) {
        return axiosInstance.get(`${EVENT_BASE_RESP_API_URL}/${eventId}`);
    }

    updateEvent(eventId, event) {
        return axiosInstance.put(`${EVENT_BASE_RESP_API_URL}/${eventId}`, event);
    }

    deleteEvent(eventId) {
        return axiosInstance.delete(`${EVENT_BASE_RESP_API_URL}/${eventId}`);
    }
}

export default new EventService();