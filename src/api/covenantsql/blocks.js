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
  }
}
