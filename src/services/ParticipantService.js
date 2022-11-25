import axiosInstance from "./AxiosInstance";

const PARTICIPANT_BASE_RESP_API_URL = 'http://localhost:9898/api/participant';

class ParticipantService {

    createParticipant(participant) {
        return axiosInstance.post(PARTICIPANT_BASE_RESP_API_URL, participant);
    }

}

export default new ParticipantService();