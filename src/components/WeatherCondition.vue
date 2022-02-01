<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="p-fluid formgrid grid">
          <div class="field col-12 md:col-3">
            <label for="state">Choose a city</label>
            <Dropdown
              id="state"
              v-model="dropdowncity"
              :options="dropdowncities"
              optionLabel="name"
              placeholder="Select One"
            ></Dropdown>
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
        <h5>City Weather</h5>
        <div class="col-62 lg:col-12 xl:col-3">
          <div class="card mb-0">
            <div class="flex justify-content-between mb-3">
              <div>
                <span class="block text-500 font-medium mb-3">Orders</span>
                <div class="text-900 font-medium text-xl">152</div>
              </div>
              <div
                class="
                  flex
                  align-items-center
                  justify-content-center
                  bg-blue-100
                  border-round
                "
                style="width: 2.5rem; height: 2.5rem"
              >
                <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
              </div>
            </div>
            <span class="text-green-500 font-medium">24 new </span>
            <span class="text-500">since last visit</span>
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
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
        },
        {
          name: "Eclair",
          calories: 262,
        },
        {
          name: "Cupcake",
          calories: 305,
        },
      ],
      dropdownItems: [
        { name: "Option 1", code: "Option 1" },
        { name: "Option 2", code: "Option 2" },
        { name: "Option 3", code: "Option 3" },
      ],
      dropdowncity: null,
      dropdowncities: [],
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

<style lang="scss" scoped>
@import "../assets/demo/badges.scss";
@import "../assets/demo/items.scss";
</style> 
