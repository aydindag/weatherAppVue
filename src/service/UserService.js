import axios from "axios";

class UserService {

    USER_SERVICE_URL = "http://localhost:8082/api/users/"

    getUserList() {
        return axios.get(this.USER_SERVICE_URL + "list");
    }

    addUser(data){
        return axios.post(this.USER_SERVICE_URL + "add/" , data);
    }
    
    deleteUser(data){
        return axios.delete(this.USER_SERVICE_URL + "delete/" + data);
    }

    updateUser(data){
        return axios.put(this.USER_SERVICE_URL + "update/" , data);
    }
}

export default new UserService();
  