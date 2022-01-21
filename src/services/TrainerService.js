import axios from 'axios'

const TRAINER_BASE_RESP_API_URL = 'http://localhost:9898/api/trainers';

class TrainerService {
    getAllTrainers() {
        return axios.get(TRAINER_BASE_RESP_API_URL);
    }

    createTrainer(trainer) {
        return axios.post(TRAINER_BASE_RESP_API_URL, trainer);
    }

    getTrainerById(trainerId) {
        return axios.get(`${TRAINER_BASE_RESP_API_URL}/${trainerId}`);
    }

    updateTrainer(trainerId, trainer) {
        return axios.put(`${TRAINER_BASE_RESP_API_URL}/${trainerId}`, trainer);
    }

    deleteTrainer(trainerId) {
        return axios.delete(`${TRAINER_BASE_RESP_API_URL}/${trainerId}`);
    }
}


export default new TrainerService();