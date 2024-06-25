import axiosInstance from "./AxiosInstance";

const SCHEDULE_BASE_RESP_API_URL = 'http://localhost:9898/api/schedule';

class ScheduleService {
    getAllSchedules() {
        return axiosInstance.get(SCHEDULE_BASE_RESP_API_URL);
    }

    createSchedule(schedule) {
        return axiosInstance.post(SCHEDULE_BASE_RESP_API_URL, schedule);
    }

    getScheduleById(scheduleId) {
        return axiosInstance.get(`${SCHEDULE_BASE_RESP_API_URL}/${scheduleId}`);
    }

    updateSchedule(scheduleId, schedule) {
        return axiosInstance.put(`${SCHEDULE_BASE_RESP_API_URL}/${scheduleId}`, schedule);
    }

    deleteSchedule(scheduleId) {
        return axiosInstance.delete(`${SCHEDULE_BASE_RESP_API_URL}/${scheduleId}`);
    }

    getStudentQuantity(){
        return axiosInstance.get(`${SCHEDULE_BASE_RESP_API_URL}/quantity`);
    }
}

export default new ScheduleService();