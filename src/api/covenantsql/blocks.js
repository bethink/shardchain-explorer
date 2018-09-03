import api from './config'

export default {
  getBlockProxy (db, key) {
    if (key.length !== 64) {
      return this.getBlockByHeight(db, key)
    }
    return this.getBlockByHash(db, key)
  },

  getBlockByHeight (db, height) {
    return api.get(`/v1/height/${db}/${height}`)
  },

  getBlockByHash (db, hash) {
    return api.get(`/v1/block/${db}/${hash}`)
  },

  async getBlockList (db, startHeight, endHeight) {
    let blockList = []
    if (!db || startHeight === endHeight) {
      return blockList
    }

    let promises = []

    if (startHeight < endHeight) {
      for (let i = startHeight; i < endHeight; i++) {
        promises.push(this.getBlockByHeight(db, i))
      }
    } else {
      for (let i = startHeight - 1; i >= endHeight; i--) {
        promises.push(this.getBlockByHeight(db, i))
      }
    }

    let result = await Promise.all(promises)
    blockList = result.map(x => x.data.data.block)
    return blockList
  },

  async getMaxHeight (db) {
    let result = await api.get(`/v1/head/${db}`)
    return result.data.data.block.height
  }
}
