import axios from 'axios'
import Conf from 'conf'
import {Context} from '../../base-with-context'

export interface GetWorkspacesElemResponse{
  workspace_id: string;
  workspace_name: string;
}

export interface GetWorkspacesResponse {
  workspaces: GetWorkspacesElemResponse[];
  current_workspace_id: string;
}

export interface GetCurrentWorkspaceResponse{
  workspace_id: string;
}

const config = new Conf()

export const select = async (currentContext: string, w_id: string): Promise<boolean> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/workspaces/${w_id}/select`
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

export const get = async (currentContext: string): Promise<GetWorkspacesResponse> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/workspaces`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data}: {data: GetWorkspacesResponse} = await axios.get(url, requestConfig)
    return data
  } catch (error) {
    throw error
  }
}

export const current = async (currentContext: string): Promise<GetCurrentWorkspaceResponse> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/workspacecurrent`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data}: {data: GetCurrentWorkspaceResponse} = await axios.get(url, requestConfig)
    return data
  } catch (error) {
    throw error
  }
}
