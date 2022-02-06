<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Advanced</h5>
        <div class="p-fluid formgrid grid">
          <div class="field col-12 md:col-3">
            <label for="state">Cities</label>
            <Dropdown
              id="state"
              v-model="dropdowncity"
              :options="dropdowncities"
              optionLabel="name"
              placeholder="Select One"
            ></Dropdown>
            <p>{{ data.email }}</p>
          </div>
          <div class="field col-12 md:col-3" style="margin-top: 23px">
            <Button
              type="button"
              class="p-button-raised mr-2 mb-2"
              label="Search"
              icon="pi pi-search"
              iconPos="right"
              @click="addWeather"
            />
          </div>
        </div>
        <h5>City Weather</h5>
        <div class="col-12 lg:col-6 xl:col-3" v-if="weatherReport">
          <div class="card mb-0">
            <div class="flex justify-content-between mb-3">
              <div>
                <span class="block text-900 font-medium mb-3">{{
                  weatherReport.city.cityName
                }}</span>
                <div class="text-900 font-medium text-xl">
                  {{ weatherReport.temperature.toFixed(2) }}°C
                </div>
              </div>
            </div>
            <span class="text-green-500 font-medium">{{
              weatherReport.weatherCondition
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import weatherReportService from "../service/WeatherReportService";
import cityService from "../service/CityService";
export default {
  data() {
    return {
      data: {
        email: "",
        cityName: "",
      },
      selectedCity: "",
      inputted: "",
      cities: null,
      city: {},
      dropdowncity: null,
      dropdowncities: [],
      weatherReports: [],
      weatherReport: null,
      weatherReportDialog: false,
      deleteWeatherReportDialog: false,
      deleteWeatherReportsDialog: false,
      images: [],
      galleriaResponsiveOptions: [
        {
          breakpoint: "1024px",
          numVisible: 5,
        },
        {
          breakpoint: "960px",
          numVisible: 4,
        },
        {
          breakpoint: "768px",
          numVisible: 3,
        },
        {
          breakpoint: "560px",
          numVisible: 1,
        },
      ],
      carouselResponsiveOptions: [
        {
          breakpoint: "1024px",
          numVisible: 3,
          numScroll: 3,
        },
        {
          breakpoint: "768px",
          numVisible: 2,
          numScroll: 2,
        },
        {
          breakpoint: "560px",
          numVisible: 1,
          numScroll: 1,
        },
      ],
    };
  },
  weatherCondition: null,
  created() {},
  mounted() {
    cityService.getCityList().then((response) => {
      if (response.data.data != null) {
        let data = response.data.data.map((x) => {
          let newObj = {};
          newObj["name"] = x.cityName;
          newObj["code"] = x.cityId;
          return newObj;
        });
        this.dropdowncities = data;
      }
    });
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    listWeather() {
      weatherReportService.getWeatherReportList().then((response) => {
        if (response.data.data != null) {
          let data = response.data.data.map((x) => {
            let newObj = {};
            newObj["cityName"] = x.city.cityName;
            newObj["temparature"] = x.temparature;
            return newObj;
          });
          this.weatherReports = data;
        }
      });
    },
    addWeather() {
      if (this.dropdowncity) {
        var weatherReportsRequest = {};
        weatherReportsRequest.cityName = this.dropdowncity.name;
        weatherReportsRequest.email = this.currentUser.email;
        weatherReportService
          .addWeatherReport(weatherReportsRequest)
          .then((response) => {
            if (response.data.success) {
              this.weatherReport = response.data.data;
            }
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/demo/badges.scss";
@import "../assets/demo/items.scss";
</style> 