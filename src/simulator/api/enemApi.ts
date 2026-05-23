import axios from 'axios'

export const enemApi = axios.create({
  baseURL: 'https://api.enem.dev/v1'
})