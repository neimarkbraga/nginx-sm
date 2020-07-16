<template>
  <div class="container py-4">

    <template v-if="itemsStatus.isLoading">
      <div class="text-center">
        <div class="spinner-border" role="status" />
      </div>
    </template>

    <template v-else-if="itemsStatus.errorMessage">
      <div class="text-center">
        <h4>Unable to load items</h4>
        <p>{{ itemsStatus.errorMessage }}</p>
        <button type="submit" class="btn btn-outline-primary">
          try Again
        </button>
      </div>
    </template>

    <template v-else>
      <form @submit.prevent="submitAdd">
        <fieldset :disabled="addStatus.isLoading">
          <table class="table table-striped">
            <thead>
            <tr>
              <th>Port</th>
              <th>Server Name</th>
              <th />
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) of items" :key="index">
              <th class="w-25">
                {{ item.port }}
              </th>
              <td>
                {{ item.name }}
              </td>
              <td>
                <button type="button"
                        :disabled="item.isDeleting"
                        @click.prevent="deleteItem(item)"
                        class="btn btn-outline-danger w-100">
                  <span v-if="item.isDeleting" class="spinner-border spinner-border-sm mr-1" role="status" />
                  Delete
                </button>
              </td>
            </tr>
            </tbody>

            <tfoot>
            <tr>
              <th class="w-25">
                <input class="form-control"
                       type="number"
                       min="80"
                       required="required"
                       v-model="addForm.port"
                       placeholder="Enter Port" />
              </th>
              <td>
                <input class="form-control"
                       type="text"
                       required="required"
                       v-model="addForm.name"
                       placeholder="Enter Server Name" />
              </td>
              <td>
                <button type="submit" class="btn btn-primary w-100">
                  <span v-if="addStatus.isLoading" class="spinner-border spinner-border-sm mr-1" role="status" />
                  <span>Add</span>
                </button>
              </td>
            </tr>
            </tfoot>
          </table>

          <template v-if="addStatus.errorMessage">
            <div class="alert alert-danger">
              <button type="button"
                      class="close"
                      @click.prevent="addStatus.errorMessage = ''">
                &times;
              </button>
              <p class="m-0">{{ addStatus.errorMessage }}</p>
            </div>
          </template>
        </fieldset>
      </form>
    </template>
  </div>
</template>

<script>
  import axios from 'axios';
  import { mapGetters } from 'vuex';
  import Utils from '../libs/Utils';

  export default {
    name: 'Home',
    data: () => ({
      items: [],
      itemsStatus: {
        isLoading: false,
        errorMessage: ''
      },
      addForm: {
        port: 0,
        name: ''
      },
      addStatus: {
        isLoading: false,
        errorMessage: ''
      }
    }),
    computed: {
      ...mapGetters({
        user: 'getUser'
      })
    },
    created() {
      if (!this.user) {
        this.$router.push('/login')
      }
      else {
        this.loadItems();
      }
    },
    methods: {
      async loadItems() {
        try {
          this.itemsStatus.isLoading = true;
          this.itemsStatus.errorMessage = '';
          const { data } = await axios.get('/api/site');
          this.items = data.map(item => {
            item.isDeleting = false;
            return item;
          });
        }
        catch (e) {
          this.itemsStatus.errorMessage = Utils.getRequestErrorMessage(e);
        }
        finally {
          this.itemsStatus.isLoading = false;
        }
      },
      async submitAdd() {
        try {
          this.addStatus.isLoading = true;
          this.addStatus.errorMessage = '';
          await axios.post('/api/site', this.addForm);
          this.items.push({...this.addForm});
          this.addForm.port = 0;
          this.addForm.name = '';
        }
        catch (e) {
          this.addStatus.errorMessage = Utils.getRequestErrorMessage(e);
        }
        finally {
          this.addStatus.isLoading = false;
        }
      },
      async deleteItem(item) {
        try {
          if (!confirm(`Do you want to delete "${item.name}?"`)) {
            return;
          }

          item.isDeleting = true;
          await axios.delete(`/api/site/${encodeURIComponent(item.name)}`);
          this.items.splice(this.items.indexOf(item), 1);
        }
        catch (e) {
          const message = Utils.getRequestErrorMessage(e);
          alert(`Delete Error: ${message}`);
        }
        finally {
          item.isDeleting = false;
        }
      }
    }
  }
</script>

<style scoped>

</style>