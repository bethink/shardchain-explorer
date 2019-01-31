import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_COVENANTSQL,
  headers: {
    'X-User-Agent': 'aletheia-webui'
  },
  withCredentials: true
})

console.log('api.covenantsql: ', process.env.API_COVENANTSQL)

export default api
