import api from './config'
import requests from './requests'

export default {
  getAckByHash (db, hash) {
    return api.get(`/v1/ack/${db}/${hash}`)
  },

  async getSQLQueryOfAck (db, ackHash) {
    let ackResp = await this.getAckByHash(db, ackHash)
    let ack = ackResp.data.data.ack
    let sqlQuery = []

    // Now, ignore "read" type
    if (ack.request.type === 'read') {
      return sqlQuery
    }

    try {
      let requestResp = await requests.getRequestByHash(db, ack.request.hash)
      let request = requestResp.data.data.request
      sqlQuery = request.queries.map(x => {
        return {
          hashes: {
            ack: ackHash,
            reqeust: request.hash,
            node: request.node
          },
          type: request.type,
          sql: x,
          timestamp: request.timestamp
        }
      })
    } catch (error) {
      console.error(`Get request for ACK#${ackHash}: ${error}`)
    }

    return sqlQuery
  },

  async gatherSQLQueriesOfAcks (db, ackHashes) {
    let queryList = []
    if (!ackHashes) {
      return queryList
    }

    let promises = ackHashes.map(x => this.getSQLQueryOfAck(db, x))
    let result = await Promise.all(promises)
    queryList = result.reduce((acc, x) => {
      acc = acc.concat(x)
      return acc
    }, [])
    return queryList
  }
}
