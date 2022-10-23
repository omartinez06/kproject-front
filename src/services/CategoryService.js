import axiosInstance from "./AxiosInstance";

const CATEGORY_BASE_RESP_API_URL = 'http://localhost:9898/api/category';

class CategoryService {
    getCategoriesByEvent(eventId) {
        return axiosInstance.get(`${CATEGORY_BASE_RESP_API_URL}/${eventId}`);
    }
}

export default new CategoryService();