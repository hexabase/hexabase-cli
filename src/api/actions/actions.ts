import axios from 'axios'
import Conf from 'conf'
import {Context} from '../../base-with-context'

export enum ActionOperation {
  new,
	update,
	delete,
	copy,
}

export interface GetActionsElemResponse {
  a_id: string;
  name: string;
  display_id: string;
  operation: ActionOperation;
  is_status_action: boolean;
  status_id: string;
  set_status: string;
}

const config = new Conf()

export const get = async (currentContext: string, d_id: string, s_id = ''): Promise<GetActionsElemResponse[]> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    let url = `${context.server}/api/v0/datastores/${d_id}/actions`
    if (s_id) {
      url = `${url}?status_id=${s_id}`
    }
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data}: {data: GetActionsElemResponse[]} = await axios.get(url, requestConfig)
    return data
  } catch (error) {
    throw error
  }
}
