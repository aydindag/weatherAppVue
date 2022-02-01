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
              v-model="dropdownuser"
              :options="dropdownusers"
              optionLabel="name"
              placeholder="Select One"
            ></Dropdown>
          </div>
          <div class="field col-12 md:col-3">
            <label for="state">City</label>
            <Dropdown
              id="user"
              v-model="dropdowncity"
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
              v-model="startDate"
            ></Calendar>
          </div>
          <div class="field col-12 md:col-3">
            <label for="state">End Date</label>
            <Calendar
              :showIcon="true"
              :showButtonBar="true"
              v-model="endDate"
            ></Calendar>
          </div>
          <div class="field col-12 md:col-3" style="margin-top: 23px">
            <Button
              type="button"
              class="p-button-raised mr-2 mb-2"
              label="Search"
              icon="pi pi-search"
              iconPos="right"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductService from "../service/ProductService";
import PhotoService from "../service/PhotoService";
import weatherReportService from "../service/WeatherReportService";
import cityService from "../service/CityService";
export default {
  data() {
    return {
      dropdownItems: [
        { name: "Option 1", code: "Option 1" },
        { name: "Option 2", code: "Option 2" },
        { name: "Option 3", code: "Option 3" },
      ],
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