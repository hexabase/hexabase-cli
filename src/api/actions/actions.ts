import axios from 'axios'
import Conf from 'conf'
import {Context} from '../../base-with-context'

export enum ActionOperation {
  new,
	update,
	delete,
	copy,
}

export interface ActionData {
  operation:  string;
  display_id?: string;
  set_status?: string;
  name:       ActionName;
  roles:      string[];
  is_status_action?: boolean;
  status_id?: string;
}

export interface ActionName {
  en: string;
  ja: string;
}

interface CreateActionResponse {
  display_id: string;
  action_id:  string;
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

export const create = async (currentContext: string, d_id: string, data: ActionData): Promise<CreateActionResponse> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/datastores/${d_id}/actions`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data: responseData}: {data: CreateActionResponse} = await axios.post(url, data, requestConfig)
    return responseData
  } catch (error) {
    throw error
  }
}

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
