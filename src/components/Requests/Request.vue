<template>
  <v-layout row wrap justify-center>
    <v-flex md8 sm12>
      <v-card>
        <v-card-title primary-title>
          <div class="headline">Request - {{ substr(request.hash, 12) }}</div>
          <v-container grid-list-md>
            <v-layout row wrap class="mono">
              <v-flex md2 sm2 caption>Time</v-flex>
              <v-flex md10 sm10>
                {{ humanReadableTime(request.timestamp) }} ({{ request.timestamp }})
              </v-flex>

              <v-flex md2 sm2 caption>Hash</v-flex>
              <v-flex md10 sm10>
                {{ request.hash }}
              </v-flex>

              <v-flex md2 sm2 caption>Node</v-flex>
              <v-flex md10 sm10>{{ request.node }}</v-flex>

              <v-flex md2 sm2 caption>Type</v-flex>
              <v-flex md10 sm10>{{ request.type }}</v-flex>

              <v-flex md2 sm2 caption>Count</v-flex>
              <v-flex md10 sm10>{{ request.count }}</v-flex>

              <v-flex md2 sm2 caption>Queries</v-flex>
              <v-flex md10 sm10>
                <v-flex class="query-item" px-0 v-for="(item, index) in request.queries" :key="index">
                  <v-flex d-inline px-0 caption>A{{index}}: </v-flex>{{ item.args }}
                  <br>
                  <v-flex d-inline px-0 caption>P{{index}}: </v-flex>{{ item.pattern }}
                </v-flex>
                <v-divider></v-divider>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-title>
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
    this.$store.dispatch('databases/setCurrentDatabase', this.$route.params.db)
    this.refreshRequest()
  },

  data () {
    return {
      request: {
        hash: ''
      }
    }
  },

  methods: {
    async refreshRequest () {
      let resp = await requests.getRequestProxy(
        this.$route.params.db,
        this.$route.params.hash
      )
      this.request = resp.data.data.request
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
