import axios from 'axios'
import Conf from 'conf'

interface GetWorkspacesElemResponse{
  workspace_id: string;
  workspace_name: string;
}

interface GetWorkspacesResponse {
  workspaces: GetWorkspacesElemResponse[];
}

const config = new Conf()

export const select = async (server: string, workspaceId: string): Promise<boolean> => {
  const url = `${server}/api/v0/workspaces/${workspaceId}/select`
  try {
    const currentContext = config.get('current-context')
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
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

export const get = async (server: string): Promise<GetWorkspacesElemResponse[]> => {
  const url = `${server}/api/v0/workspaces`
  try {
    const currentContext = config.get('current-context')
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
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
