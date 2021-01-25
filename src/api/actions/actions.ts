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
  operation?:  string;
  display_id?: string;
  set_status?: string;
  name?:       ActionName;
  roles?:      string[];
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
  action_id: string;
  name: string;
  display_id: string;
  operation: ActionOperation;
  is_status_action: boolean;
  status_id: string;
  set_status: string;
}

interface GetActionSettingsResponse {
  workspace_id:     string;
  project_id:       string;
  datastore_id:     string;
  action_id:        string;
  status_id?:       string;
  is_status_action: boolean;
  display_id:       string;
  description?:     string;
  search_keys:      string;
  operation:        string;
  set_status:       string;
  name:             ActionName;
  roles: {[key: string]: string | boolean}[];
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

export const getOne = async (currentContext: string, d_id: string, a_id: string): Promise<GetActionSettingsResponse> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/datastores/${d_id}/actions/${a_id}`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data}: {data: GetActionSettingsResponse} = await axios.get(url, requestConfig)
    return data
  } catch (error) {
    throw error
  }
}

export const update = async (currentContext: string, d_id: string, a_id: string, data: ActionData): Promise<void> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/datastores/${d_id}/actions/${a_id}`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    await axios.patch(url, data, requestConfig)
  } catch (error) {
    throw error
  }
}

export const del = async (currentContext: string, d_id: string, a_id: string): Promise<void> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/datastores/${d_id}/actions/${a_id}`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    await axios.delete(url, requestConfig)
  } catch (error) {
    throw error
  }
}
