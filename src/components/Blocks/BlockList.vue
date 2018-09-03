<template>
  <v-layout row wrap justify-center>
    <v-flex md10 sm12>
      <v-data-table
        :headers="blockListHeaders"
        :items="blockList"
        :total-items="total"
        :pagination.sync="pagination"
        :loading="loading"
        class="elevation-1"
        item-key="height"
        :rows-per-page-items="[10,20,30,50]"
      >
        <template slot="items" slot-scope="props">
          <tr class="mono">
            <td>{{ props.item.height }}</td>
            <td>{{ humanReadableTime(props.item.timestamp) }}</td>
            <td>{{ substr(props.item.hash, 32) }}</td>
            <td
              :class="props.item.queries.length > 0 ? 'primary--text font-weight-bold' : 'grey--text'"
            >{{ props.item.queries.length > 0 ? props.item.queries.length : 'none' }}</td>
            <td>
              <v-btn flat icon color="primary" :to="{name: 'Block', params: {db: currentDatabase, hash: props.item.height}}">
                <v-icon small>mdi-eye</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { blocks } from '@/api/covenantsql'
import toolkit from '@/components/Utils/toolkit'

export default {
  mixins: [toolkit],
  mounted () {
    this.currentDatabase = this.$route.params.db
    this.refreshBlockList()
  },

  data () {
    return {
      blockList: [],
      blockListHeaders: [
        { text: '# Height', value: 'height' },
        { text: 'Time', value: 'time', sortable: false },
        { text: 'Hash', value: 'hash', sortable: false },
        { text: 'SQL', value: 'sql', sortable: false },
        { text: 'View', Value: 'view', sortable: false }
      ],
      pagination: {
        rowsPerPage: 10,
        sortBy: 'height',
        descending: true
      },
      total: 0,
      loading: false
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

  watch: {
    pagination: {
      handler () {
        this.refreshBlockList()
      }
    }
  },

  methods: {
    async refreshBlockList () {
      console.log(this.pagination)
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      this.loading = true
      this.total = (await blocks.getMaxHeight(this.currentDatabase)) + 1
      let startHeight = (page - 1) * rowsPerPage
      let endHeight = startHeight + rowsPerPage
      if (endHeight > this.total) {
        endHeight = this.total
      }

      if (sortBy === 'height' && descending) {
        startHeight = this.total - (page - 1) * rowsPerPage
        endHeight = startHeight - rowsPerPage
        endHeight = endHeight < 0 ? 0 : endHeight
      }
      console.debug(
        `refreshBlockList, total=${
          this.total
        }, page=${page}, rowsPerPage=${rowsPerPage}, startHeight=${startHeight}, endHeight=${endHeight}, sortBy=${sortBy}`
      )
      this.blockList = await blocks.getBlockList(
        this.currentDatabase,
        startHeight,
        endHeight
      )
      this.loading = false
    }
  }
}
</script>
