<template>
  <v-layout rows wrap justify-center>
    <v-flex md8 xs12 v-if="error">
      <sp-error-card :error="error"></sp-error-card>
    </v-flex>
    <v-card v-else>
      <v-card-title primary-title>
        <div class="headline">
          Block #{{ block.count }}
        </div>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md pt-0>
          <v-layout row wrap class="mono" justify-center>
            <!-- block info panel -->
            <v-flex md8 xs12>
              <v-layout row wrap>
                <v-flex md2 xs2 caption>Count</v-flex>
                <v-flex md10 xs10>
                  <router-link :to="{name: 'Block', params: {db: currentDatabase, hash: block.count-1}}" class="block-nav-link">&lt;&lt;</router-link>
                  {{ block.count }}
                  <router-link :to="{name: 'Block', params: {db: currentDatabase, hash: block.count+1}}" class="block-nav-link">&gt;&gt;</router-link>

                  <router-link :to="{name: 'BlockList', params: {db: currentDatabase}}">List</router-link>
                </v-flex>

                <v-flex md2 xs2 caption>Height</v-flex>
                <v-flex md10 xs10>
                  {{ block.height }}
                </v-flex>

                <v-flex md2 xs2 caption>Time</v-flex>
                <v-flex md10 xs10>
                  {{ humanReadableTime(block.timestamp) }} ({{ block.timestamp }})
                </v-flex>

                <v-flex md2 xs2 caption>Hash</v-flex>
                <v-flex md10 xs10>
                  {{ block.hash }}
                </v-flex>

                <v-flex md2 xs2 caption>Version</v-flex>
                <v-flex md10 xs10>{{ block.version }}</v-flex>

                <v-flex md2 xs2 caption>Producer</v-flex>
                <v-flex md10 xs10>
                  {{ block.producer }}
                </v-flex>

                <v-flex md2 xs2 caption>Acks</v-flex>
                <v-flex md10 xs10>
                  <span v-if="!block.queries || block.queries.length === 0" class="grey--text">
                    None
                  </span>
                  <v-flex v-for="item in block.queries" :key="item" px-0>
                    <router-link :to="{name: 'Ack', params: {db: currentDatabase, hash: item}}">
                      {{ item }}
                    </router-link>
                  </v-flex>
                </v-flex>
              </v-layout>
            </v-flex>

            <!-- divider -->
            <v-flex md12 xs12 mt-3>
              <v-divider></v-divider>
            </v-flex>

            <!-- SQL list -->
            <v-flex md12 xs12 title my-3>
              SQL
            </v-flex>

            <v-flex md12 xs12 v-if="sqlList.length === 0" grey--text>
              None
            </v-flex>
            <v-flex md12 xs12 v-else>
              <v-data-table :headers="sqlListHeaders" :items="sqlList" hide-actions item-key="timestamp">
                <template slot="items" slot-scope="props">
                  <tr v-if="props.item.error" class="red lighten-4">
                    <td colspan="5" class="error--text text--darken-2">

                      ERROR: gather SQL statements from
                      ACK#<router-link :to="{name:'Ack',params:{db:currentDatabase,hash:props.item.ackHash}}">{{ props.item.ackHash.substring(0,16) }}</router-link>
                      failed: {{ props.item.error.status }}

                    </td>
                  </tr>
                  <tr v-else>
                    <td>{{ humanReadableTime(props.item.timestamp) }}</td>
                    <td>
                      <v-layout column>
                        <v-flex>
                          REQ
                          <router-link :to="{name: 'Request', params: {db: currentDatabase, hash: props.item.requestHash}}">
                            {{ substr(props.item.requestHash, 16) }}
                          </router-link>
                        </v-flex>
                        <v-flex>
                          ACK
                          <router-link :to="{name: 'Ack', params: {db: currentDatabase, hash: props.item.ackHash}}">
                            {{ substr(props.item.ackHash, 16) }}
                          </router-link>
                        </v-flex>
                        <v-flex>
                          NOD {{ substr(props.item.nodeHash, 16) }}
                        </v-flex>
                      </v-layout>
                    </td>
                    <td :class="`sql-type-${props.item.type}`">{{ props.item.type }}</td>
                    <td>{{ props.item.sql.pattern }}</td>
                    <td>{{ props.item.sql.args }}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { blocks, acks } from '@/api/covenantsql'
import SPErrorCard from '@/components/SPErrorCard'
import toolkit from '@/components/Utils/toolkit'

export default {
  mixins: [toolkit],
  components: {
    'sp-error-card': SPErrorCard
  },

  mounted () {
    this.initialize()
  },

  data () {
    return {
      block: {
        count: 0,
        height: 0,
        genesis_hash: '',
        hash: '',
        producer: '',
        queries: [],
        timestamp: 0,
        version: 0
      },
      sqlList: [],
      sqlListHeaders: [
        { text: 'Time', value: 'time', sortable: false },
        { text: 'Hashes', value: 'hashes', sortable: false },
        { text: 'Type', value: 'type', sortable: false },
        { text: 'SQL', value: 'sql', sortable: false },
        { text: 'Args', value: 'args', sortable: false }
      ],
      error: null
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
    initialize () {
      this.error = null
      this.currentDatabase = this.$route.params.db
      this.refreshBlock()
    },

    async refreshBlock () {
      try {
        // NB: the ":hash" variable also can be an integer (block count)
        let resp = await blocks.getBlockProxy(
          this.currentDatabase,
          this.$route.params.hash
        )
        this.block = resp.data.data.block
      } catch (error) {
        this.error = error.response.data
      }

      // Gather SQL
      this.sqlList = await acks.gatherSQLQueriesOfAcks(
        this.currentDatabase,
        this.block.queries
      )
      console.debug('Gather SQL list:', this.sqlList)
    }
  },

  watch: {
    $route (to, from) {
      console.debug(`watch($route): ${from.path} -> ${to.path}`)
      this.initialize()
    }
  }
}
</script>

<style lang="scss" scoped>
.block-nav-link {
  text-decoration: none;
  font-weight: bold;
}
</style>
