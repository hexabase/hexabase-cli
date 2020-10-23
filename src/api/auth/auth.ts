import axios from 'axios'

export const login = async (server: string, email: string, password: string): Promise<string> => {
  const url = `${server}/api/v0/login`
  try {
    const {data: {token}} = await axios.post(url, {email, password})
    return token
  } catch (error) {
    throw error
  }
}
