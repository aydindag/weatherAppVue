import axios from "axios";

class WeatherReportService {

    WEATHERREPORT_SERVICE_URL = "http://localhost:8082/api/weatherReports/"
    
    getWeatherReportList(){
        return axios.get(this.WEATHERREPORT_SERVICE_URL + "list");
    }

    addWeatherReport(data){
        return axios.post(this.WEATHERREPORT_SERVICE_URL + "add/" , data);
    }
    deleteWeatherReport(data){
        return axios.delete(this.WEATHERREPORT_SERVICE_URL + "delete/" , data);
    }
    updateWeatherReport(data){
        return axios.put(this.WEATHERREPORT_SERVICE_URL + "update/" , data);
    }
    getWeatherReportsWithFilter(data){
        return axios.post(this.WEATHERREPORT_SERVICE_URL + "getWeatherReportsWithFilter", data);
    }
}

export default new WeatherReportService();