import axios from 'axios'

const FILE_BASE_RESP_API_URL = 'http://localhost:9898/api/file';

class FileService {
    createFileImage(file, fileName) {
        const formData = new FormData();
        formData.append("fileImage", file);
        formData.append("name", fileName);
        return axios.post(FILE_BASE_RESP_API_URL, formData, { headers: { "content-type": "multipart/form-data" } });
    }
}

export default new FileService();