import axiosInstance from "./AxiosInstance";

const KYU_BASE_RESP_API_URL = 'http://localhost:9898/api/kyu';

class KyuService {
    getAllKyus() {
        return axiosInstance.get(KYU_BASE_RESP_API_URL);
    }

    createKyu(kyu) {
        return axiosInstance.post(KYU_BASE_RESP_API_URL, kyu);
    }

    getKyuById(kyuId) {
        return axiosInstance.get(`${KYU_BASE_RESP_API_URL}/${kyuId}`);
    }

    updateKyu(kyuId, kyu) {
        return axiosInstance.put(`${KYU_BASE_RESP_API_URL}/${kyuId}`, kyu);
    }

    deleteKyu(kyuId) {
        return axiosInstance.delete(`${KYU_BASE_RESP_API_URL}/${kyuId}`);
    }
}

export default new KyuService();