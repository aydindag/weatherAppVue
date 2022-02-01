import axios from "axios";

class CityService{

    CITY_SERVICE_URL = "http://localhost:8082/api/cities/"

    getCityList() {
        return axios.get(this.CITY_SERVICE_URL + "list");
    }

    addCity(data){
        return axios.post(this.CITY_SERVICE_URL + "add/" , data);
    }

    deleteCity(data){
        return axios.delete(this.CITY_SERVICE_URL + "delete/" + data);
    }

    updateCity(data){
        return axios.put(this.CITY_SERVICE_URL + "update/" , data);
    }

}
export default new CityService;