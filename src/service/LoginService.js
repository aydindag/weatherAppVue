import axios from "axios";
import UserService from "./UserService";

class LoginService{
    LOGIN_SERVICE_URL = "http://localhost:8082/api/login/"

    loginUser(){
        return axios.post(this.LOGIN_SERVICE_URL + "login/" , data);
    }
}

export default new LoginService();