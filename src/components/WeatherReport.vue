<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Weather Reports</h5>
        <div class="p-fluid formgrid grid">
          <div class="field col-12 md:col-3">
            <label for="state">User</label>
            <Dropdown
              id="user"
              v-model="weatherData.user"
              :options="dropdownusers"
              optionLabel="name"
              placeholder="Select One"
            ></Dropdown>
          </div>
          <div class="field col-12 md:col-3">
            <label for="state">City</label>
            <Dropdown
              id="city"
              v-model="weatherData.city"
              :options="dropdowncities"
              optionLabel="name"
              placeholder="Select One"
            ></Dropdown>
          </div>

          <div class="field col-12 md:col-3">
            <label for="state">Start Date</label>
            <Calendar
              :showIcon="true"
              :showButtonBar="true"
              v-model="weatherData.startDate"
              dateFormat="dd.mm.yy"
            ></Calendar>
          </div>
          <div class="field col-12 md:col-3">
            <label for="state">End Date</label>
            <Calendar
              :showIcon="true"
              :showButtonBar="true"
              v-model="weatherData.endDate"
              dateFormat="dd.mm.yy"
            ></Calendar>
          </div>
          <div class="field col-12 md:col-3" style="margin-top: 23px">
            <Button
              type="button"
              class="p-button-raised mr-2 mb-2"
              label="Search"
              icon="pi pi-search"
              iconPos="right"
              @click="searchReport"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="card">
        <h5>Weather Report List</h5>
        <DataTable
          :value="getWeatherReports"
          :paginator="true"
          class="p-datatable-gridlines"
          :rows="10"
          dataKey="id"
          :rowHover="true"
          v-model:filters="filters1"
          filterDisplay="menu"
          :loading="loading1"
          :filters="filters1"
          responsiveLayout="scroll"
        >
          <template #empty> There is no user. </template>
          <template #loading> Loading customers data. Please wait. </template>
          <Column field="firstName" header="Name" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.user?.firstName ? data.user.firstName : "" }}
            </template>
          </Column>
          <Column field="lastName" header="Surname" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.user?.lastName ? data.user.lastName : "" }}
            </template>
          </Column>
          <Column field="cityName" header="CityName" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.city?.cityName ? data.city.cityName : "" }}
            </template>
          </Column>
          <Column field="queryTime" header="queryTime" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.queryTime + " ms" }}
            </template>
          </Column>
          <Column field="ipAddress" header="ipAddress" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.ipAddress }}
            </template>
          </Column>
          <Column field="queryDate" header="queryDate" style="min-width: 12rem">
            <template #body="{ data }">
              {{ formatDate(data.queryDate) }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import ProductService from "../service/ProductService";
import PhotoService from "../service/PhotoService";
import weatherReportService from "../service/WeatherReportService";
import cityService from "../service/CityService";
import userService from "../service/UserService";
import moment from "moment";
export default {
  data() {
    return {
      weatherData: {
        user: {},
        city: {},
        startDate: "",
        endDate: "",
      },
      getWeatherReports: [],
      startDate: null,
      endDate: null,
      dropdowncity: null,
      dropdowncities: [],
      dropdownuser: null,
      dropdownusers: [],
      weatherReports: null,
      weatherReport: {},
      weatherReportDialog: false,
      deleteWeatherReportDialog: false,
      deleteWeatherReportsDialog: false,
      products: [],
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
    };
  },
  weatherCondition: null,
  created() {
    this.productService = new ProductService();
    this.photoService = new PhotoService();
  },
  mounted() {
    userService.getUserList().then((response) => {
      let data = response.data.data.map((x) => {
        let newObj = {};
        newObj["name"] = x.firstName + " " + x.lastName;
        newObj["code"] = x.userId;
        return newObj;
      });
      this.dropdownusers = data;
    });
    cityService.getCityList().then((response) => {
      if (response.data.data != null) {
        let data = response.data.data.map((x) => {
          let newObj = {};
          newObj["name"] = x.cityName;
          newObj["code"] = x.cityName;
          return newObj;
        });
        this.dropdowncities = data;
      }
    });
    weatherReportService.getWeatherReportList().then((response) => {
      this.weatherConditions = response.data.data;
    });
    this.productService.getProductsSmall().then((products) => {
      this.products = products;
    });
    this.photoService.getImages().then((images) => {
      this.images = images;
    });
  },
  methods: {
    formatDate(date) {
      if (date) return moment(date).format("DD.MM.YYYY");
      return;
    },
    searchReport() {
      var _request = {};
      _request.cityName = this.weatherData.city.code;
      _request.userId = this.weatherData.user.code;
      _request.endDate = this.weatherData.endDate;
      _request.startDate = this.weatherData.startDate;
      debugger;
      weatherReportService
        .getWeatherReportsWithFilter(_request)
        .then((response) => {
          if (response.data.data && response.data.success) {
            this.getWeatherReports = response.data.data;
          }
        });
    },
    editProduct(weatherReport) {
      this.weatherReport = { weatherReport };
      this.weatherReportDialog = true;
    },
    confirmDeleteProduct(weatherReport) {
      this.weatherReport = weatherReport;
      this.deleteWeatherReportDialog = true;
    },
    deleteProduct() {
      this.weatherReports = this.weatherReports.filter(
        (val) => val.id !== this.weatherReport.id
      );
      this.deleteWeatherReportsDialog = false;
      this.weatherReport = {};
      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Deleted",
        life: 3000,
      });
    },
  },
};
</script>