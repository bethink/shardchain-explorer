<template><v-card>
  <v-card-title primary-title>
    <div class="headline">
      Block #{{ block.height }}
    </div>
  </v-card-title>
  <v-card-text>
    <v-container grid-list-md pt-0>
      <v-layout row wrap class="mono" justify-center>
        <!-- block info panel -->
        <v-flex md8 xs12>
          <v-layout row wrap>
            <v-flex md2 xs2 caption>Height</v-flex>
            <v-flex md10 xs10>
              <router-link
                :to="{name: 'Block', params: {db: currentDatabase, hash: block.height-1}}"
                class="block-nav-link"
              >&lt;&lt;</router-link>
              {{ block.height }}
              <router-link
                :to="{name: 'Block', params: {db: currentDatabase, hash: block.height+1}}"
                class="block-nav-link"
              >&gt;&gt;</router-link>

              <router-link :to="{name: 'BlockList', params: {db: currentDatabase}}">List</router-link>
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
        <v-flex md12 xs12 v-if="sqlList.length > 0">
          <v-data-table
            :headers="sqlListHeaders"
            :items="sqlList"
            hide-actions
            item-key="timestamp"
          >
            <template slot="items" slot-scope="props">
              <td>{{ humanReadableTime(props.item.timestamp) }}</td>
              <td>
                <v-layout column>
                  <v-flex>
                    REQ
                    <router-link :to="{name: 'Request', params: {db: currentDatabase, hash: props.item.hashes.reqeust}}">
                      {{ substr(props.item.hashes.reqeust, 16) }}
                    </router-link>
                  </v-flex>
                  <v-flex>
                    ACK
                    <router-link :to="{name: 'Ack', params: {db: currentDatabase, hash: props.item.hashes.ack}}">
                      {{ substr(props.item.hashes.ack, 16) }}
                    </router-link>
                  </v-flex>
                  <v-flex>
                    NOD {{ substr(props.item.hashes.node, 16) }}
                  </v-flex>
                </v-layout>
              </td>
              <td :class="`sql-type-${props.item.type}`">{{ props.item.type }}</td>
              <td>{{ props.item.sql.pattern }}</td>
              <td>{{ props.item.sql.args }}</td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card-text>
</v-card></template>

<script>
import { blocks, acks } from '@/api/covenantsql'
import toolkit from '@/components/Utils/toolkit'

export default {
  mixins: [toolkit],
  mounted () {
    this.initialize()
  },

  data () {
    return {
      block: {
        hash: ''
      },
      sqlList: [],
      sqlListHeaders: [
        { text: 'Time', value: 'time', sortable: false },
        { text: 'Hashes', value: 'hashes', sortable: false },
        { text: 'Type', value: 'type', sortable: false },
        { text: 'SQL', value: 'sql', sortable: false },
        { text: 'Args', value: 'args', sortable: false }
      ]
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
      this.currentDatabase = this.$route.params.db
      this.refreshBlock()
    },

    async refreshBlock () {
      // NB: the ":hash" variable also can be an integer (block height)
      let resp = await blocks.getBlockProxy(
        this.currentDatabase,
        this.$route.params.hash
      )
      this.block = resp.data.data.block

      // Gather SQL
      this.sqlList = await acks.gatherSQLQueriesOfAcks(
        this.currentDatabase,
        this.block.queries
      )
    }
  },

  watch: {
    $route (to, from) {
      console.debug('watch($route):', from, ' --> ', to)
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
