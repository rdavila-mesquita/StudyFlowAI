import axios from 'axios'

export const questionApi = axios.create({
  baseURL: 'http://localhost:8000/api/agentes/simulation'
})