<template>
  <Toast />
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>New City</h5>
        <div class="p-fluid formgrid grid">
          <div class="field col-12 md:col-6">
            <label for="cityName">City Name</label>
            <InputText
              id="cityName"
              v-model="city.cityName"
              style=""
              type="text"
            />
          </div>

          <div class="field col-12 md:col-3" style="margin-top: 23px">
            <Button
              label="Add City"
              class="p-button-raised mr-2 mb-2"
              @click="saveCity"
            />
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <h5>City List</h5>
          <DataTable
            :value="cities"
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
            <template #header>
              <div class="flex justify-content-between flex-column sm:flex-row">
                <span class="p-input-icon-left mb-2">
                  <i class="pi pi-search" />
                  <InputText
                    v-model="filters1['global'].value"
                    placeholder="Search City"
                    style="width: 100%"
                  />
                </span>
              </div>
            </template>
            <template #empty>There is no city. </template>
            <template #loading> Loading cities data. Please wait. </template>
            <Column
              field="cityName"
              header="City Name"
              style="min-width: 65rem"
            >
              <template #body="{ data }">
                {{ data.cityName }}
              </template>
            </Column>

            <Column field="empty" header="" style="min-width: 1rem">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
                  @click="editCity(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger mt-2"
                  @click="confirmDeleteCity(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
          <Dialog
            v-model:visible="cityDialog"
            :style="{ width: '450px' }"
            header="City Details"
            :modal="true"
            class="p-fluid"
          >
            <div class="field">
              <label for="name">City Name</label>
              <InputText
                id="name"
                v-model.trim="updateCity.cityName"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !updateCity.cityName }"
              />
              <small class="p-invalid" v-if="submitted && !updateCity.cityName"
                >City is required.</small
              >
            </div>

            <template #footer>
              <Button
                label="Cancel"
                icon="pi pi-times"
                class="p-button-text"
                @click="hideDialog"
              />
              <Button
                label="Save"
                icon="pi pi-check"
                class="p-button-text"
                @click="onClickUpdateCity"
              />
            </template>
          </Dialog>

          <Dialog
            v-model:visible="deleteCityDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true"
          >
            <div class="flex align-items-center justify-content-center">
              <i
                class="pi pi-exclamation-triangle mr-3"
                style="font-size: 2rem"
              />
              <span v-if="updateCity"
                >Are you sure you want to delete <b>{{ updateCity.cityName }}</b
                >?</span
              >
            </div>
            <template #footer>
              <Button
                label="No"
                icon="pi pi-times"
                class="p-button-text"
                @click="deleteCityDialog = false"
              />
              <Button
                label="Yes"
                icon="pi pi-check"
                class="p-button-text"
                @click="deleteCity"
              />
            </template>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cityService from "../service/CityService";
import { FilterMatchMode, FilterOperator } from "primevue/api";
export default {
  data() {
    return {
      city: {
        cityId: null,
        cityName: "",
      },
      cities: null,
      updateCity: {
        cityId: null,
        cityName: "",
      },
      cityDialog: false,
      deleteCityDialog: false,
      filters1: null,
      filters2: {},
      loading1: true,
      loading2: true,
      idFrozen: false,
      expandedRows: [],
    };
  },

  created() {
    this.initFilters1();
  },
  mounted() {
    cityService.getCityList().then((response) => {
      this.cities = response.data.data;
      this.loading1 = false;
    });
  },
  methods: {
    initFilters1() {
      this.filters1 = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        "city.cityName": {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
        balance: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        status: {
          operator: FilterOperator.OR,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS },
      };
    },
    hideDialog() {
      this.submitted = false;
    },
    saveCity() {
      this.submitted = true;
      if (this.city.cityName) {
        cityService.addCity(this.city).then((response) => {
          if (response.data.success) {
            this.cities.push(response.data.data);
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "City Inserted",
              life: 3000,
            });
          }
        });
        this.clear();
      } else {
        this.$toast.add({
          severity: "warning",
          summary: "Warning",
          detail: "Please fill the City Name",
          life: 3000,
        });
      }
    },
    onClickUpdateCity() {
      this.submitted = true;
      var _updateCity = { ...this.updateCity };
      if (this.updateCity.cityName) {
        cityService.updateCity(this.updateCity).then((response) => {
          if (response.data.success) {
            this.cities[this.findIndexById(_updateCity.cityId)] = _updateCity;
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "City Updated",
              life: 3000,
            });
          }
        });
      } else {
        this.$toast.add({
          severity: "warning",
          summary: "Warning",
          detail: "Please fill the City Name",
          life: 3000,
        });
      }
      this.cityDialog = false;
      this.updateCity = {};
    },
    editCity(city) {
      this.updateCity = { ...city };
      this.cityDialog = true;
    },
    confirmDeleteCity(city) {
      this.updateCity = city;
      this.deleteCityDialog = true;
    },
    deleteCity() {
      var _deleteCityRequest = {};
      _deleteCityRequest["cityId"] = this.updateCity.cityId;
      cityService.deleteCity(_deleteCityRequest.cityId).then((response) => {
        if (response.data.success) {
          this.cities.splice(this.findIndexById(_deleteCityRequest.cityId), 1);
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "City Deleted",
            life: 3000,
          });
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "Error While City Delete",
            life: 3000,
          });
        }
      });
      this.deleteCityDialog = false;
      this.updateCity = {};
    },
    clearFilter1() {
      this.initFilters1();
    },
    clear() {
      this.city = {
        cityId: null,
        cityName: "",
      };
      this.updateCity = {};
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.cities.length; i++) {
        if (this.cities[i].cityId === id) {
          index = i;
          break;
        }
      }
      return index;
    },
    expandAll() {
      this.expandedRows = this.products.filter((p) => p.id);
    },
    collapseAll() {
      this.expandedRows = null;
    },
    formatCurrency(value) {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },
    formatDate(value) {
      return value.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    calculateCustomerTotal(name) {
      let total = 0;
      if (this.customer3) {
        for (let customer of this.customer3) {
          if (customer.representative.name === name) {
            total++;
          }
        }
      }

      return total;
    },
  },
};
</script>