<template>
  <v-layout row wrap justify-center fill-height>
    <v-flex md8 sm8>
      <v-layout column>
        <v-card>
          <v-card-title primary-title>
            <v-layout column>
              <v-flex
                headline
                primary--text
                text--darken-1
                text-sm-center
                text-md-center
              >
                <Logo id="logo"/>
              </v-flex>
              <v-text-field
                v-model.trim="searchContent"
                hide-details
                label="Hashes / Block Height / Kayak Offset ..."
                single-line
                append-icon="mdi-magnify"
                color="primary darken-1"
                @input="search"
              ></v-text-field>
            </v-layout>
          </v-card-title>
        </v-card>

        <v-card class="mt-1" v-if="!currentDatabase">
          <v-card-title primary-title>
            <v-flex caption text-sm-center red--text text--darken-1 font-weight-bold>NO DATABASE SPECIFIED</v-flex>
          </v-card-title>
        </v-card>

        <v-card class="mt-1" v-if="currentDatabase">
          <v-card-title primary-title>
            <!-- the search results -->
            <v-layout column v-if="results.length > 0">
              <v-flex caption>SEARCH RESULT</v-flex>
              <v-list dense class="mono">
                <v-list-tile
                  avatar
                  v-for="item in results" :key="item.target"
                  :to="item.href"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>
                      <v-layout row wrap>
                        <v-flex md3 sm3 caption :class="'result-label-' + item.target">
                          {{ item.target }}
                        </v-flex>
                        <v-flex md9 sm9>
                          {{ item.result }}
                        </v-flex>
                      </v-layout>
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-layout>

            <!-- the latest blocks -->
            <v-layout column v-if="results.length == 0">
              <v-flex caption>LATEST BLOCKS</v-flex>
              <v-list dense class="mono">
                <v-list-tile
                  avatar
                  v-for="item in latestBlocks" :key="item.height"
                  :to="`/blocks/${currentDatabase}/${item.height}`"
                >
                  <v-list-tile-title>
                    <v-layout row wrap>
                      <v-flex md2 sm2>#{{ item.height }}</v-flex>
                      <v-flex md6 sm6>
                        {{ humanReadableTime(item.timestamp) }}
                      </v-flex>
                      <v-flex md4 sm4>
                        {{ substr(item.hash, 16) }}
                        <span class="has-sql primary--text" v-if="item.queries.length">
                          (SQL)
                        </span>
                      </v-flex>
                    </v-layout>
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-layout>
          </v-card-title>
        </v-card>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { blocks, acks, requests } from '@/api/covenantsql'
import toolkit from '@/components/Utils/toolkit'
import Logo from '@/assets/logo.svg'

const NUM_SHOW_RECENT_BLOCKS = 10

export default {
  mixins: [toolkit],

  components: {
    Logo
  },

  mounted () {
    this.refreshLatestBlocks()
  },

  data () {
    return {
      searchContent: '',
      results: [],
      latestBlocks: []
    }
  },

  watch: {
    currentDatabase: function (to, from) {
      console.debug('watch(currentDatabase): ', from, ' --> ', to)
      this.refreshLatestBlocks()
    }
  },

  methods: {
    search () {
      console.log('searching...')
      if (!this.$store.state.databases.currentDatabase) {
        console.error('no database specified')
        return
        // TODO: give some error information
      }

      this.results = []
      if (this.searchContent === '') {
        return
      }

      console.info(`search: ${this.searchContent}`)
      // Define result object and show them in a list
      blocks
        .getBlockProxy(this.currentDatabase, this.searchContent)
        .then(resp => {
          let block = resp.data.data.block
          this.results.push({
            target: 'BLOCK',
            result: `${this.substr(block.hash, 32)} #${block.height}`,
            href: `/blocks/${this.currentDatabase}/${block.height}`
          })
        })

      acks.getAckByHash(this.currentDatabase, this.searchContent).then(resp => {
        let ack = resp.data.data.ack
        this.results.push({
          target: 'ACK',
          result: this.substr(ack.hash, 32),
          href: `/acks/${this.currentDatabase}/${ack.hash}`
        })
      })

      requests
        .getRequestProxy(this.currentDatabase, this.searchContent)
        .then(resp => {
          let request = resp.data.data.request
          this.results.push({
            target: 'REQUEST',
            result: this.substr(request.hash, 32),
            href: `/requests/${this.currentDatabase}/${request.hash}`
          })
        })
    },

    async refreshLatestBlocks () {
      this.latestBlocks = []
      if (!this.currentDatabase) {
        return
      }
      let promises = []
      for (let i = 0; i < NUM_SHOW_RECENT_BLOCKS; i++) {
        promises.push(blocks.getBlockByHeight(this.currentDatabase, i))
      }

      let result = await Promise.all(promises)
      this.latestBlocks = result.map(x => x.data.data.block)
    }
  },

  computed: {
    currentDatabase () {
      return this.$store.state.databases.currentDatabase
    }
  }
}
</script>

<style lang="scss" scoped>
.result-label-BLOCK {
  color: #0f37d6;
  font-weight: bold;
}
.result-label-ACK {
  color: #ef3412;
  font-weight: bold;
}
.result-label-REQUEST {
  color: green;
  font-weight: bold;
}
.has-sql {
  font-size: 0.75em;
  font-weight: bold;
}
#logo {
  fill: #1272e4;
  height: 48px;
}
#logo:hover {
  fill: black;
}
</style>
