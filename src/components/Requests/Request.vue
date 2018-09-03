<template>
  <v-layout row wrap justify-center>
    <v-flex md8 xs12>
      <v-card v-if="!request.hash">
        <v-card-title primary-title>
          <v-flex headline text-md-center text-xs-center>
            NOT FOUND
          </v-flex>
        </v-card-title>
        <v-card-text>
          <v-flex text-md-center text-xs-center grey--text>
            Server Response: {{ request }}
          </v-flex>
        </v-card-text>
      </v-card>
      <v-card v-if="request.hash">
        <v-card-title primary-title>
          <div class="headline">Request - {{ substr(request.hash, 12) }}</div>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md pt-0>
            <v-layout row wrap class="mono">
              <v-flex md2 xs2 caption>Time</v-flex>
              <v-flex md10 xs10>
                {{ humanReadableTime(request.timestamp) }} ({{ request.timestamp }})
              </v-flex>

              <v-flex md2 xs2 caption>Hash</v-flex>
              <v-flex md10 xs10>
                {{ request.hash }}
              </v-flex>

              <v-flex md2 xs2 caption>Node</v-flex>
              <v-flex md10 xs10>{{ request.node }}</v-flex>

              <v-flex md2 xs2 caption>Type</v-flex>
              <v-flex md10 xs10 :class="`sql-type-${request.type}`">{{ request.type }}</v-flex>

              <v-flex md2 xs2 caption>Count</v-flex>
              <v-flex md10 xs10>{{ request.count }}</v-flex>

              <v-flex md2 xs2 caption>Queries</v-flex>
              <v-flex md10 xs10>
                <v-flex class="query-item" px-0 v-for="(item, index) in request.queries" :key="index">
                  <v-flex d-inline px-0 caption>A{{index}}: </v-flex>{{ item.args }}
                  <br>
                  <v-flex d-inline px-0 caption>P{{index}}: </v-flex>{{ item.pattern }}
                </v-flex>
                <v-divider></v-divider>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { requests } from '@/api/covenantsql'
import toolkit from '@/components/Utils/toolkit'

export default {
  mixins: [toolkit],
  mounted () {
    this.currentDatabase = this.$route.params.db
    this.refreshRequest()
  },

  data () {
    return {
      request: {
        hash: ''
      }
    }
  },

  computed: {
    currentDatabase: {
      get () {
        return this.$store.state.databases.currentDatabase
      },
      set (newValue) {
        this.$store.dispatch('databases/setCurrentDatabase', newValue)
      }
    }
  },

  methods: {
    async refreshRequest () {
      try {
        let resp = await requests.getRequestProxy(
          this.$route.params.db,
          this.$route.params.hash
        )
        this.request = resp.data.data.request
      } catch (error) {
        this.request = error.response.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
