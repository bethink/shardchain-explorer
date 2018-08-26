import api from './config'

export default {
  getAckByHash (db, hash) {
    return api.get(`/v1/ack/${db}/${hash}`)
  }
}
