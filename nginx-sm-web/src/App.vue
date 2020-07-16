<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#">Nginx Site Manager</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul v-if="user" class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {{ user.username }}
              </a>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <a class="dropdown-item"
                   @click.prevent="logout"
                   href="#">Logout</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer class="p-3 bg-dark text-white">
      &copy; M Apps
    </footer>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'App',
    computed: {
      ...mapGetters({
        user: 'getUser'
      })
    },
    methods: {
      logout() {
        if (window.confirm('Do you want to logout?')) {
          this.$store.commit('setToken', '');
          this.$router.push('/login');
        }
      }
    }
  }
</script>

<style lang="scss">
  html, body {
    margin: 0;
    padding: 0;
  }

  #app {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    & > main {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;

      & > * {
        width: 100%;
      }
    }
  }
</style>
