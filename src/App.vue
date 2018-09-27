<template>
  <div id="app">
    <v-app>
      <v-toolbar color="primary" app fixed prominent dark class="pt-1">
        <v-toolbar-title>
          <router-link to="/" class="site-title">CovenantSQL Explorer</router-link>
        </v-toolbar-title>
        <!-- <v-text-field v-model="currentDatabase" prepend-icon="mdi-database" color="white" placeholder="Database Address">
        </v-text-field> -->
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-select v-model="currentDatabase" placeholder="Database Address" :items="databaseList" prepend-icon="mdi-database" dense hide-details :menu-props="{minWidth:'375px'}">
            <v-list-tile slot="prepend-item">
              <v-text-field v-model="newDatabase" placeholder="Use new database address" prepend-icon="mdi-database" @change="useNewDatabaseAddress"></v-text-field>
            </v-list-tile>
            <v-divider slot="prepend-item" class="mt-3"></v-divider>
          </v-select>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container fluid>
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

  created () {
    this.$store.dispatch('databases/loadDatabaseList')
    this.currentDatabase = localStorage.getItem('lastAddr')
  },

  data () {
    return {
      databaseHistory: [],
      newDatabase: ''
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
    },

    databaseList () {
      return this.$store.state.databases.databaseList.map(item => {
        return { value: item, text: `${item.substring(0, 16)} ... ${item.substring(56)}` }
      })
    }
  },

  methods: {
    useNewDatabaseAddress () {
      this.$store.dispatch('databases/addNewDatabase', this.newDatabase)
      this.currentDatabase = this.newDatabase
      this.newDatabase = ''
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
.sql-type-read {
  color: #388e3c;
}
.sql-type-write {
  color: #d32f2f;
}
</style>
