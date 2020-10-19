import axios, {AxiosRequestConfig} from 'axios'
import Conf from 'conf'

interface GetWorkspacesElemResponse{
  workspace_id: string;
  workspace_name: string;
}

interface GetWorkspacesResponse {
  workspaces: GetWorkspacesElemResponse[];
}

const config = new Conf()

export const select = async (wID: string): Promise<boolean> => {
  try {
    const url = `https://az-api.hexabase.com/api/v0/workspaces/${wID}/select`
    const token = config.get('hexabase.token')
    const requestConfig: AxiosRequestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {status} = await axios.post(url, {}, requestConfig)
    return (status >= 200 && status < 300)
  } catch (error) {
    throw error
  }
}

export const get = async (): Promise<GetWorkspacesElemResponse[]> => {
  try {
    const url = 'https://az-api.hexabase.com/api/v0/workspaces'
    const token = config.get('hexabase.token')
    const requestConfig: AxiosRequestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data}: {data: GetWorkspacesResponse} = await axios.get(url, requestConfig)
    return data.workspaces
  } catch (error) {
    throw error
  }
}
