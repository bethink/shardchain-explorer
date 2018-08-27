<template>
  <div id="app">
    <v-app>
      <v-toolbar
        color="primary"
        app
        fixed
        prominent
        dark
        class="pt-1"
      >
        <v-toolbar-title>
          <router-link to="/" class="site-title">CovenantSQL Explorer</router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="currentDatabase"
          prepend-icon="mdi-database"
          color="white"
          placeholder="Database Address"
        >
        </v-text-field>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <router-view></router-view>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
// import { createNamespacedHelpers } from 'vuex'
// const { mapState } = createNamespacedHelpers('databases')

export default {
  name: 'App',

  mounted () {
    this.currentDatabase = localStorage.getItem('lastAddr')
  },

  data () {
    return {
      databaseHistory: []
    }
  },

  computed: {
    // ...mapState({
    //   currentDatabase: state => state.currentDatabase
    // })
    currentDatabase: {
      get () {
        return this.$store.state.databases.currentDatabase
      },
      set (newValue) {
        this.$store.dispatch('databases/setCurrentDatabase', newValue)
      }
    }
  }
}
</script>

<style>
.mono {
  font-family: Menlo, Consolas, monospace;
}
.site-title {
  color: white;
  text-decoration: none;
}
</style>
