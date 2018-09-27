<template>
  <v-layout row wrap justify-center>
    <v-flex md10 sm12>
      <v-data-table :headers="blockListHeaders" :items="blockList" :total-items="total" :pagination.sync="pagination" :loading="loading" class="elevation-1" item-key="count" :rows-per-page-items="[10,20,30,50]">
        <template slot="items" slot-scope="props">
          <tr class="mono" :class="!!props.item.error ? 'red lighten-4' : ''">
            <td>{{ props.item.count }}</td>
            <td>{{ humanReadableTime(props.item.timestamp) }}</td>
            <td v-if="!!!props.item.error">
              {{ substr(props.item.hash, 32) }}
            </td>
            <td v-else class="error--text text--darken-2">
              {{ props.item.error.status }}
            </td>
            <td :class="props.item.queries.length > 0 ? 'primary--text font-weight-bold' : 'grey--text'">{{ props.item.queries.length > 0 ? props.item.queries.length : 'none' }}</td>
            <td>
              <v-btn flat icon color="primary" :to="{name: 'Block', params: {db: currentDatabase, hash: props.item.count}}" :disabled="!!props.item.error">
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
        { text: '# Count', value: 'count' },
        { text: 'Time', value: 'time', sortable: false },
        { text: 'Hash', value: 'hash', sortable: false },
        { text: 'SQL', value: 'sql', sortable: false },
        { text: 'View', Value: 'view', sortable: false }
      ],
      pagination: {
        rowsPerPage: 10,
        sortBy: 'count',
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
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      this.loading = true
      this.total = (await blocks.getMaxCount(this.currentDatabase)) + 1
      let startCount = (page - 1) * rowsPerPage
      let endCount = startCount + rowsPerPage
      if (endCount > this.total) {
        endCount = this.total
      }
      if (startCount < 0) {
        startCount = 0
      }

      if (sortBy === 'count' && descending) {
        startCount = this.total - (page - 1) * rowsPerPage
        endCount = startCount - rowsPerPage
        endCount = endCount < 0 ? 0 : endCount
      }
      console.debug(
        `refreshBlockList, total=${
          this.total
        }, page=${page}, rowsPerPage=${rowsPerPage}, startCount=${startCount}, endCount=${endCount}, sortBy=${sortBy}`
      )
      this.blockList = await blocks.getBlockList(
        this.currentDatabase,
        startCount,
        endCount
      )
      this.loading = false
    }
  }
}
</script>
