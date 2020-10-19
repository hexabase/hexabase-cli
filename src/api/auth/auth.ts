import axios from 'axios'

export const login = async (email: string, password: string): Promise<string> => {
  const url = 'https://az-api.hexabase.com/api/v0/login'
  try {
    const {data: {token}} = await axios.post(url, {email, password})
    return token
  } catch (error) {
    throw error
  }
}
