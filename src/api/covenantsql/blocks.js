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

  async getBlockList (db, startCount, endCount) {
    let blockList = []
    if (!db || startCount === endCount) {
      return blockList
    }

    let promises = []

    if (startCount < endCount) {
      for (let i = startCount; i < endCount; i++) {
        promises.push(this.getBlockByCount(db, i))
      }
    } else {
      for (let i = startCount - 1; i >= endCount; i--) {
        promises.push(this.getBlockByCount(db, i))
      }
    }

    let result = await Promise.all(promises)
    blockList = result.map(x => x.data.data.block)
    return blockList
  },

  async getMaxCount (db) {
    let result = await api.get(`/v2/head/${db}`)
    return result.data.data.block.count
  }
}
