<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>New User</h5>
        <div class="p-fluid formgrid grid">
          <div class="field col-12 md:col-6">
            <label for="firstname2">Firstname</label>
            <InputText id="firstname2" type="text" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="lastname2">Lastname</label>
            <InputText id="lastname2" type="text" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="city">Email</label>
            <InputText id="city" type="text" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="city">Password</label>
            <InputText id="city" type="text" />
          </div>
          <div class="field col-12 md:col-3">
            <label for="state">Role</label>
            <div class="field-checkbox mb-0">
              <Checkbox
                id="checkOption1"
                name="option"
                value="Chicago"
                v-model="checkboxValue"
              />
              <label for="checkOption1">Admin</label>
            </div>
          </div>
          <div class="field col-12 md:col-3">
            <label for="add"> </label>
            <Button label="Add User" class="p-button-raised mr-2 mb-2" />
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <h5>User List</h5>
          <DataTable
            :value="users"
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
                    placeholder="Search User"
                    style="width: 100%"
                  />
                </span>
              </div>
            </template>
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="firstName" header="Name" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.firstName }}
              </template>
            </Column>
            <Column field="lastName" header="Surname" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.lastName }}
              </template>
            </Column>
            <Column field="email" header="Email" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.email }}
              </template>
            </Column>
            <Column field="admin" header="Role" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.admin ? "ADMIN" : "KULLANICI" }}
              </template>
            </Column>
            <Column field="Delete,UPDATE" header="" style="min-width: 12rem">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
                  @click="editProduct(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger mt-2"
                  @click="confirmDeleteProduct(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
          <Dialog
            v-model:visible="userDialog"
            :style="{ width: '450px' }"
            header="User Details"
            :modal="true"
            class="p-fluid"
          >
            <div class="field">
              <label for="name">Name</label>
              <InputText
                id="name"
                v-model.trim="user.firstName"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !user.firstName }"
              />
              <small class="p-invalid" v-if="submitted && !user.firstName"
                >Name is required.</small
              >
            </div>
            <div class="field">
              <label for="lastName">Last Name</label>
              <InputText
                id="lastName"
                v-model="user.lastName"
                required="true"
              />
            </div>

            <div class="field">
              <label for="email" class="mb-3">Email</label>
              <InputText id="email" v-model="user.email" required="true" />
            </div>

            <div class="field">
              <label class="mb-3">Role</label>
              <div class="formgrid grid">
                <div class="field-radiobutton col-6">
                  <div class="field-checkbox mb-0">
                    <Checkbox
                      id="checkOption1"
                      name="option"
                      value="Chicago"
                      v-model="checkboxValue2"
                    />
                    <label for="checkOption1">Admin</label>
                  </div>
                </div>
              </div>
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
                @click="saveProduct"
              />
            </template>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from "../service/UserService";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import CustomerService from "../service/CustomerService";
import ProductService from "../service/ProductService";
export default {
  data() {
    return {
      dropdownItems: [
        { name: "Option 1", code: "Option 1" },
        { name: "Option 2", code: "Option 2" },
        { name: "Option 3", code: "Option 3" },
      ],
      dropdownItem: null,
      customer1: null,
      customer2: null,
      customer3: null,
      filters1: null,
      filters2: {},
      loading1: true,
      loading2: true,
      idFrozen: false,
      products: null,
      users: null,
      user: {},
      userDialog: false,
      deleteUserDialog: false,
      deleteUsersDialog: false,
      checkboxValue: [],
      checkboxValue2: [],
      expandedRows: [],
    };
  },

  customerService: null,
  productService: null,
  created() {
    this.customerService = new CustomerService();
    this.productService = new ProductService();
    this.initFilters1();
    var data = null;

    console.log(data);
  },
  mounted() {
    userService.getUserList().then((response) => {
      this.users = response.data.data;
      this.loading1 = false;
    });
    /* this.productService
      .getProductsWithOrdersSmall()
      .then((data) => (this.products = data));
    this.customerService.getCustomersLarge().then((data) => {
      this.customer1 = data;
      this.loading1 = false;
      this.customer1.forEach(
        (customer) => (customer.date = new Date(customer.date))
      );
    });
    this.customerService
      .getCustomersLarge()
      .then((data) => (this.customer2 = data));
    this.customerService
      .getCustomersMedium()
      .then((data) => (this.customer3 = data)); */
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
        "country.name": {
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
      this.productDialog = false;
      this.submitted = false;
    },
    saveProduct() {
      this.submitted = true;
      if (this.product.name.trim()) {
        if (this.product.id) {
          this.product.inventoryStatus = this.product.inventoryStatus.value
            ? this.product.inventoryStatus.value
            : this.product.inventoryStatus;
          this.products[this.findIndexById(this.product.id)] = this.product;
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Product Updated",
            life: 3000,
          });
        } else {
          this.product.id = this.createId();
          this.product.code = this.createId();
          this.product.image = "product-placeholder.svg";
          this.product.inventoryStatus = this.product.inventoryStatus
            ? this.product.inventoryStatus.value
            : "INSTOCK";
          this.products.push(this.product);
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Product Created",
            life: 3000,
          });
        }
        this.productDialog = false;
        this.product = {};
      }
    },
    editProduct(user) {
      this.user = { ...user };
      this.userDialog = true;
    },
    confirmDeleteProduct(user) {
      this.user = user;
      this.deleteUserDialog = true;
    },
    deleteProduct() {
      this.users = this.users.filter((val) => val.id !== this.user.id);
      this.deleteUserDialog = false;
      this.user = {};
      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Deleted",
        life: 3000,
      });
    },
    clearFilter1() {
      this.initFilters1();
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