import axiosInstance from "./AxiosInstance";

const TRAINER_BASE_RESP_API_URL = 'http://localhost:9898/api/trainers';

class TrainerService {
    getAllTrainers() {
        return axiosInstance.get(TRAINER_BASE_RESP_API_URL);
    }

    createTrainer(trainer) {
        return axiosInstance.post(TRAINER_BASE_RESP_API_URL, trainer);
    }

    getTrainerById(trainerId) {
        return axiosInstance.get(`${TRAINER_BASE_RESP_API_URL}/${trainerId}`);
    }

    updateTrainer(trainerId, trainer) {
        return axiosInstance.put(`${TRAINER_BASE_RESP_API_URL}/${trainerId}`, trainer);
    }

    deleteTrainer(trainerId) {
        return axiosInstance.delete(`${TRAINER_BASE_RESP_API_URL}/${trainerId}`);
    }

    getTrainerQuantity(){
        return axiosInstance.get(`${TRAINER_BASE_RESP_API_URL}/quantity`);
    }

}


export default new TrainerService();