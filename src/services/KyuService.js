import axios from 'axios'

const KYU_BASE_RESP_API_URL = 'http://localhost:9898/api/kyu';

class KyuService {
    getAllKyus() {
        return axios.get(KYU_BASE_RESP_API_URL);
    }

    createKyu(kyu) {
        return axios.post(KYU_BASE_RESP_API_URL, kyu);
    }

    getKyuById(kyuId) {
        return axios.get(`${KYU_BASE_RESP_API_URL}/${kyuId}`);
    }

    updateKyu(kyuId, kyu) {
        return axios.put(`${KYU_BASE_RESP_API_URL}/${kyuId}`, kyu);
    }

    deleteKyu(kyuId) {
        return axios.delete(`${KYU_BASE_RESP_API_URL}/${kyuId}`);
    }
}

export default new KyuService();