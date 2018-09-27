import api from './config'

export default {
  getBlockProxy (db, key) {
    if (key.length !== 64) {
      return this.getBlockByCount(db, key)
    }
    return this.getBlockByHash(db, key)
  },

  getBlockByCount (db, count) {
    return api.get(`/v1/count/${db}/${count}`)
  },

  getBlockByHash (db, hash) {
    return api.get(`/v1/block/${db}/${hash}`)
  },

  async getBlockByCountIgnoreError (db, count) {
    try {
      const resp = await this.getBlockByCount(db, count)
      let block = resp.data.data.block
      // if (block.count >= 90 && block.count < 94) {
      //   block.error = { status: 'mock error' }
      // }
      return block
    } catch (error) {
      const errorResp = error.response.data
      console.error(`get block ${count} failed: ${JSON.stringify(errorResp)}`)
      return {
        count: count,
        hash: '',
        height: 0,
        producer: '',
        queries: [],
        timestamp: 0,
        version: 0,
        error: errorResp
      }
    }
  },

  async getBlockList (db, startCount, endCount) {
    let blockList = []
    if (!db || startCount === endCount) {
      return blockList
    }

    let promises = []

    if (startCount < endCount) {
      for (let i = startCount; i < endCount; i++) {
        promises.push(this.getBlockByCountIgnoreError(db, i))
      }
    } else {
      for (let i = startCount - 1; i >= endCount; i--) {
        promises.push(this.getBlockByCountIgnoreError(db, i))
      }
    }

    blockList = await Promise.all(promises)
    return blockList
  },

  async getMaxCount (db) {
    let result = await api.get(`/v2/head/${db}`)
    return result.data.data.block.count
  }
}
