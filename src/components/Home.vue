<template>
  <v-layout row wrap justify-center fill-height>
    <v-flex md8 sm8>
      <v-layout column>
        <v-card class="pa-3 mt-4">
          <v-card-title primary-title>
            <v-flex
              headline
              red--text
              text--darken-4
              text-sm-center
              text-md-center
            >
              WE DO SAVE THE WORLD
            </v-flex>
          </v-card-title>
          <v-text-field
            v-model="searchContent"
            hide-details
            label="Hashes / Block Height / Kayak Offset ..."
            single-line
            append-icon="mdi-magnify"
            color="red darken-4"
            @keyup.enter="search"
          ></v-text-field>
        </v-card>

        <!-- the search results shortcuts -->
        <v-card class="mt-2" v-if="results.length > 0">
          <v-flex v-if="noResultCount === 3">
            No record found!
          </v-flex>
          <v-list dense>
            <v-list-tile
              avatar
              v-for="item in results" :key="item.target"
              :to="item.href"
            >
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-layout row wrap>
                    <v-flex md3 sm3 text-sm-center caption :class="'result-label-' + item.target">
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
        </v-card>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { blocks, acks, requests } from '@/api/covenantsql'
import toolkit from '@/components/Utils/toolkit'

export default {
  mixins: [toolkit],

  data () {
    return {
      searchContent: '',
      results: []
    }
  },

  methods: {
    search () {
      console.log('searching...')
      if (!this.$store.state.databases.currentDatabase) {
        console.error('no database specified')
        // TODO: give some error information
      } else {
        console.info(`search: ${this.searchContent}`)
        this.results = []
        this.noResultCount = 0
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

        acks
          .getAckByHash(this.currentDatabase, this.searchContent)
          .then(resp => {
            this.results.push({
              target: 'ACK',
              result: this.substr(resp.data.data.ack.hash, 32),
              href: `/acks/${this.currentDatabase}/${resp.data.data.ack.hash}`
            })
          })

        requests
          .getRequestProxy(this.currentDatabase, this.searchContent)
          .then(resp => {
            this.results.push({
              target: 'REQUEST',
              result: this.substr(resp.data.data.request.hash, 32),
              href: `/requests/${this.currentDatabase}/${
                resp.data.data.request.hash
              }`
            })
          })
      }
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
</style>
