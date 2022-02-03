<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>New User</h5>
        <div class="p-fluid formgrid grid">
          <div class="field col-12 md:col-6">
            <label for="firstName">Firstname</label>
            <InputText
              id="firstName"
              v-model="user.firstName"
              style=""
              type="text"
            />
          </div>
          <div class="field col-12 md:col-6">
            <label for="lastName">Lastname</label>
            <InputText
              id="lastName"
              v-model="user.lastName"
              style=""
              type="text"
            />
          </div>
          <div class="field col-12 md:col-6">
            <label for="email">Email</label>
            <InputText id="email" v-model="user.email" type="text" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="password">Password</label>
            <Password id="password" v-model="user.password" toggleMask />
          </div>
          <div class="field col-12 md:col-3">
            <label for="isAdmin">Role</label>
            <div class="field-checkbox mb-0">
              <Checkbox
                id="isAdmin"
                name="option"
                :binary="true"
                v-model="user.isAdmin"
              />
              <label for="isAdmin">Admin</label>
            </div>
          </div>
          <div class="field col-12 md:col-3">
            <label for="Add User"> </label>
            <Button
              label="Add User"
              class="p-button-raised mr-2 mb-2"
              @click="saveUser"
            />
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
            <template #empty> There is no user. </template>
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
                {{ data.isAdmin ? "ADMIN" : "USER" }}
              </template>
            </Column>
            <Column field="Delete,UPDATE" header="" style="min-width: 12rem">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
                  @click="editUser(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger mt-2"
                  @click="confirmDeleteUser(slotProps.data)"
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
                v-model.trim="updateUser.firstName"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !updateUser.firstName }"
              />
              <small class="p-invalid" v-if="submitted && !updateUser.firstName"
                >Name is required.</small
              >
            </div>
            <div class="field">
              <label for="lastName">Last Name</label>
              <InputText
                id="lastName"
                v-model="updateUser.lastName"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !updateUser.lastName }"
              />
              <small class="p-invalid" v-if="submitted && !updateUser.lastName"
                >Last Name is required.</small
              >
            </div>

            <div class="field">
              <label for="email" class="mb-3">Email</label>
              <InputText
                id="email"
                v-model="updateUser.email"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !updateUser.email }"
              />
              <small class="p-invalid" v-if="submitted && !updateUser.email"
                >Email is required.</small
              >
            </div>

            <div class="field">
              <label class="mb-3">Role</label>
              <div class="formgrid grid">
                <div class="field-radiobutton col-6">
                  <div class="field-checkbox mb-0">
                    <Checkbox
                      id="admin1"
                      name="option"
                      :binary="true"
                      v-model="updateUser.isAdmin"
                      :class="{
                        'p-invalid': submitted && !updateUser.isAdmin,
                      }"
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
                @click="onClickUpdateUser"
              />
            </template>
          </Dialog>
          <Dialog
            v-model:visible="deleteUserDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true"
          >
            <div class="flex align-items-center justify-content-center">
              <i
                class="pi pi-exclamation-triangle mr-3"
                style="font-size: 2rem"
              />
              <span v-if="updateUser"
                >Are you sure you want to delete <b>{{ updateUser.email }}</b
                >?</span
              >
            </div>
            <template #footer>
              <Button
                label="No"
                icon="pi pi-times"
                class="p-button-text"
                @click="deleteUserDialog = false"
              />
              <Button
                label="Yes"
                icon="pi pi-check"
                class="p-button-text"
                @click="deleteUser"
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
export default {
  data() {
    return {
      user: {
        userId: null,
        firstName: "",
        lastName: "",
        email: "",
        isAdmin: false,
        password: null,
      },
      users: null,
      updateUser: {
        userId: null,
        firstName: "",
        lastName: "",
        email: "",
        isAdmin: "",
        password: null,
      },
      userDialog: false,
      deleteUserDialog: false,
      filters1: null,
      filters2: {},
      loading1: true,
      loading2: true,
      idFrozen: false,
      expandedRows: [],
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    this.initFilters1();
    var data = null;

    console.log(data);
  },
  mounted() {
    userService.getUserList().then((response) => {
      this.users = response.data.data;
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
      this.submitted = false;
    },
    saveUser() {
      console.log(this.currentUser);
      this.submitted = true;
      if (this.user.firstName) {
        userService.addUser(this.user).then((response) => {
          if (response.data.success) {
            this.users.push(response.data.data);
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "User Inserted",
              life: 3000,
            });
          }
        });
        this.clear();
      } else {
        this.$toast.add({
          severity: "warning",
          summary: "Warning",
          detail: "Please fill the User Name",
          life: 3000,
        });
      }
      this.submitted = false;
    },
    onClickUpdateUser() {
      this.submitted = true;
      var _updateUser = { ...this.updateUser };
      debugger;
      if (this.updateUser.firstName) {
        userService.updateUser(this.updateUser).then((response) => {
          if (response.data.success) {
            this.users[this.findIndexById(_updateUser.userId)] = _updateUser;
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "User Updated",
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
      this.userDialog = false;
      this.updateUser = {};
    },
    editUser(user) {
      this.updateUser = { ...user };
      this.userDialog = true;
    },
    confirmDeleteUser(user) {
      this.updateUser = user;
      this.deleteUserDialog = true;
    },
    deleteUser() {
      var _deleteUserRequest = {};
      _deleteUserRequest["userId"] = this.updateUser.userId;
      userService.deleteUser(_deleteUserRequest.userId).then((response) => {
        if (response.data.success) {
          this.users.splice(this.findIndexById(_deleteUserRequest.userId), 1);
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "User Deleted",
            life: 3000,
          });
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "Error While User Delete",
            life: 3000,
          });
        }
      });
      this.deleteUserDialog = false;
      this.updateUser = {};
    },
    clearFilter1() {
      this.initFilters1();
    },
    clear() {
      this.user = {
        userId: null,
        firstName: "",
        lastName: "",
        email: "",
        isAdmin: "false",
        password: null,
      };
      this.updateUser = {};
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].userId === id) {
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