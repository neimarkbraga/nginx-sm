<template>
  <div class="flex-fill d-flex align-items-center justify-content-center">
    <div class="w-100" style="max-width: 550px">
      <div class="card">
        <div class="card-header">
          <h5 class="m-0">Login Page</h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="submit">
            <fieldset :disabled="status.isLoading">

              <!-- username -->
              <div class="form-group">
                <label>Username</label>
                <input type="text"
                       required="required"
                       v-model="formData.username"
                       placeholder="Enter username"
                       class="form-control">
              </div>

              <!-- password -->
              <div class="form-group">
                <label>Password</label>
                <input type="password"
                       required="required"
                       v-model="formData.password"
                       placeholder="Enter password"
                       class="form-control">
              </div>

              <!-- recaptcha -->
              <div class="form-group text-center">
                <ReCaptcha ref="ReCaptcha"
                           class="d-inline-block"
                           v-model="formData.recaptcha"
                           sitekey="6LdqJrIZAAAAAMlbwvU-4JTnm_j6np8XhHXyyuJ6" />
              </div>

              <!-- error message -->
              <template v-if="status.errorMessage">
                <div class="alert alert-danger">
                  <button type="button"
                          class="close"
                          @click.prevent="status.errorMessage = ''">
                    &times;
                  </button>
                  <p class="m-0">{{ status.errorMessage }}</p>
                </div>
              </template>

              <!-- submit -->
              <button type="submit" class="btn btn-primary w-100">
                <span v-if="status.isLoading" class="spinner-border spinner-border-sm mr-1" role="status" />
                <span>Login</span>
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Utils from '../libs/Utils';

  export default {
    name: 'Login',
    data: () => ({
      formData: {
        username: '',
        password: '',
        recaptcha: ''
      },
      status: {
        isLoading: false,
        errorMessage: ''
      }
    }),
    methods: {
      submit() {
        const { formData, status } = this;
        setTimeout(async () => {
          try {
            status.isLoading = true;
            status.errorMessage = '';
            const { data } = await axios.post('/api/login', formData);
            this.$store.commit('setToken', data.token);
            await this.$router.push('/');
          }
          catch (e) {
            status.errorMessage = Utils.getRequestErrorMessage(e);
          }
          finally {
            status.isLoading = false;
            this.$refs.ReCaptcha.reset();
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>