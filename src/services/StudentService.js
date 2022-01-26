import axios from 'axios'

const STUDENT_BASE_RESP_API_URL = 'http://localhost:9898/api/students';

class StudentService {

    getAllStudents() {
        return axios.get(STUDENT_BASE_RESP_API_URL);
    }

    createStudent(student) {
        return axios.post(STUDENT_BASE_RESP_API_URL, student);
    }

    getStudentById(studentId) {
        return axios.get(`${STUDENT_BASE_RESP_API_URL}/${studentId}`);
    }

    updateStudent(studentId, student) {
        return axios.put(`${STUDENT_BASE_RESP_API_URL}/${studentId}`, student);
    }

    deleteStudent(studentId) {
        return axios.delete(`${STUDENT_BASE_RESP_API_URL}/${studentId}`);
    }

}

export default new StudentService();