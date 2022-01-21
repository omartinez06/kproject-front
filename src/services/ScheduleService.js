import axios from 'axios'

const SCHEDULE_BASE_RESP_API_URL = 'http://localhost:9898/api/schedule';

class ScheduleService {
    getAllSchedules() {
        return axios.get(SCHEDULE_BASE_RESP_API_URL);
    }

    createSchedule(schedule) {
        return axios.post(SCHEDULE_BASE_RESP_API_URL, schedule);
    }

    getScheduleById(scheduleId) {
        return axios.get(`${SCHEDULE_BASE_RESP_API_URL}/${scheduleId}`);
    }

    updateSchedule(scheduleId, schedule) {
        return axios.put(`${SCHEDULE_BASE_RESP_API_URL}/${scheduleId}`, schedule);
    }

    deleteSchedule(scheduleId) {
        return axios.delete(`${SCHEDULE_BASE_RESP_API_URL}/${scheduleId}`);
    }
}

export default new ScheduleService();