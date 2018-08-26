<template>
  <v-layout row wrap justify-center>
    <v-flex md8 sm12>
      <v-card>
        <v-card-title primary-title>
          <div class="headline">Block #{{ block.height }}</div>
          <v-container grid-list-md>
            <v-layout row wrap class="mono">
              <v-flex md2 sm2 caption>Height</v-flex>
              <v-flex md10 sm10>
                <router-link
                  :to="{name: 'Block', params: {db: db, hash: block.height-1}}"
                  class="block-nav-link"
                >&lt;&lt;</router-link>
                {{ block.height }}
                <router-link
                  :to="{name: 'Block', params: {db: db, hash: block.height+1}}"
                  class="block-nav-link"
                >&gt;&gt;</router-link>
              </v-flex>

              <v-flex md2 sm2 caption>Time</v-flex>
              <v-flex md10 sm10>
                {{ humanReadableTime(block.timestamp) }} ({{ block.timestamp }})
              </v-flex>

              <v-flex md2 sm2 caption>Hash</v-flex>
              <v-flex md10 sm10>
                {{ block.hash }}
              </v-flex>

              <v-flex md2 sm2 caption>Version</v-flex>
              <v-flex md10 sm10>{{ block.version }}</v-flex>

              <v-flex md2 sm2 caption>Producer</v-flex>
              <v-flex md10 sm10>
                {{ block.producer }}
              </v-flex>

              <v-flex md2 sm2 caption>Acks</v-flex>
              <v-flex md10 sm10>
                <v-flex v-for="item in block.queries" :key="item" px-0>
                  <router-link :to="'/acks/' + $route.params.db + '/' + item">
                    {{ item }}
                  </router-link>
                </v-flex>
              </v-flex>

            </v-layout>
          </v-container>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { blocks } from '@/api/covenantsql'
import toolkit from '@/components/Utils/toolkit'

export default {
  mixins: [toolkit],
  mounted () {
    this.initialize()
  },

  data () {
    return {
      db: '',
      block: {
        hash: ''
      }
    }
  },

  methods: {
    initialize () {
      this.db = this.$route.params.db
      this.$store.dispatch('databases/setCurrentDatabase', this.db)
      this.refreshBlock()
    },

    async refreshBlock () {
      // NB: the ":hash" variable also can be an integer (block height)
      let resp = await blocks.getBlockProxy(this.db, this.$route.params.hash)
      this.block = resp.data.data.block
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
