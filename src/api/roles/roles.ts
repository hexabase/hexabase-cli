import axios from 'axios'
import Conf from 'conf'
import {Context} from '../../base-with-context'

export interface GetProjectRolesElemResponse {
  display_id: string;
  name:       string;
  project_id: string;
  role_id:    string;
  type:       string;
}

const config = new Conf()

export const get = async (currentContext: string, p_id: string): Promise<GetProjectRolesElemResponse[]> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/applications/${p_id}/roles`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data}: {data: GetProjectRolesElemResponse[]} = await axios.get(url, requestConfig)
    return data
  } catch (error) {
    throw error
  }
}
