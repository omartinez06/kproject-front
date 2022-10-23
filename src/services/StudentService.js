import axiosInstance from "./AxiosInstance";

const STUDENT_BASE_RESP_API_URL = 'http://localhost:9898/api/students';

class StudentService {

    getAllStudents() {
        return axiosInstance.get(STUDENT_BASE_RESP_API_URL);
    }

    createStudent(student) {
        return axiosInstance.post(STUDENT_BASE_RESP_API_URL, student);
    }

    getStudentById(studentId) {
        return axiosInstance.get(`${STUDENT_BASE_RESP_API_URL}/${studentId}`);
    }

    updateStudent(studentId, student) {
        return axiosInstance.put(`${STUDENT_BASE_RESP_API_URL}/${studentId}`, student);
    }

    deleteStudent(studentId) {
        return axiosInstance.delete(`${STUDENT_BASE_RESP_API_URL}/${studentId}`);
    }

    getStudentQuantity(){
        return axiosInstance.get(`${STUDENT_BASE_RESP_API_URL}/quantity`);
    }

}

export default new StudentService();