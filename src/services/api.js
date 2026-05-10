import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
})

export const fetchData = async () => {
  try {
    const response = await api.get('/api/players')
    console.log('Koneksi Berhasil.', response.data)
    return response.data
  } catch (error) {
    console.error('Koneksi Gagal:', error.message?.data || error.message)
  }
}

export default api
