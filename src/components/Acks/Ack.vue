<template>
  <v-layout row wrap justify-center>
    <v-flex md8 sm12>
      <v-card>
        <v-card-title primary-title>
          <div class="headline">ACK - {{ substr(ack.hash, 12) }}</div>
          <v-container grid-list-md>
            <v-layout row wrap class="mono">
              <v-flex md2 sm2 caption>Time</v-flex>
              <v-flex md10 sm10>
                {{ humanReadableTime(ack.timestamp) }} ({{ ack.timestamp }})
              </v-flex>

              <v-flex md2 sm2 caption>Hash</v-flex>
              <v-flex md10 sm10>
                {{ ack.hash }}
              </v-flex>

              <v-flex md2 sm2 caption>Node</v-flex>
              <v-flex md10 sm10>{{ ack.node }}</v-flex>

              <v-flex md2 sm2 caption>Request</v-flex>
              <v-flex md10 sm10></v-flex>
              <v-flex md2 sm2 caption pl-3>-Time</v-flex>
              <v-flex md10 sm10>
                {{ humanReadableTime(ack.request.timestamp) }} ({{ ack.request.timestamp }})
              </v-flex>
              <v-flex md2 sm2 caption pl-3>-Hash</v-flex>
              <v-flex md10 sm10>
                <router-link :to="'/requests/' + $route.params.db + '/' + ack.request.hash" >{{ ack.request.hash }}</router-link>
              </v-flex>

              <v-flex md2 sm2 caption>Response</v-flex>
              <v-flex md10 sm10></v-flex>
              <v-flex md2 sm2 caption pl-3>-Time</v-flex>
              <v-flex md10 sm10>
                {{ humanReadableTime(ack.response.timestamp) }} ({{ ack.response.timestamp }})
              </v-flex>
              <v-flex md2 sm2 caption pl-3>-Hash</v-flex>
              <v-flex md10 sm10>
                {{ ack.response.hash }}
              </v-flex>
              <v-flex md2 sm2 caption pl-3>-Node</v-flex>
              <v-flex md10 sm10>
                {{ ack.response.node }}
              </v-flex>
              <v-flex md2 sm2 caption pl-3>-LogPosition</v-flex>
              <v-flex md10 sm10>
                {{ ack.response.log_position }}
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { acks } from '@/api/covenantsql'
import toolkit from '@/components/Utils/toolkit'

export default {
  mixins: [toolkit],
  mounted () {
    this.$store.dispatch('databases/setCurrentDatabase', this.$route.params.db)
    this.refreshAck()
  },

  data () {
    return {
      ack: {
        hash: '',
        request: {
          hash: ''
        },
        response: {
          hash: ''
        }
      }
    }
  },

  methods: {
    async refreshAck () {
      let resp = await acks.getAckByHash(
        this.$route.params.db,
        this.$route.params.hash
      )
      this.ack = resp.data.data.ack
    }
  }
}
</script>
