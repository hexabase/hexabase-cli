import axios, {AxiosRequestConfig} from 'axios'
import Conf from 'conf'

const config = new Conf()

export const select = async (wID: string): Promise<void> => {
  try {
    const url = `https://az-api.hexabase.com/api/v0/workspaces/${wID}/select`
    const token = config.get('hexabase.token')
    const requestConfig: AxiosRequestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    await axios.post(url, {}, requestConfig)
  } catch (error) {
    throw error
  }
}
