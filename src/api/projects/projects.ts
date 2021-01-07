import axios from 'axios'
import Conf from 'conf'
import {Context} from '../../base-with-context'

export interface ProjectName{
    en: string;
    ja: string;
}

export interface CreateProjectData{
  name: ProjectName;
  tp_id?: string;
}

interface CreateProjectResponse {
  p_id: string;
}

interface GetProjectsElemResponse {
  application_id: string;
  name: string;
  display_id: string;
}

const config = new Conf()

export const create = async (currentContext: string, data: CreateProjectData): Promise<CreateProjectResponse> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/applications`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data: responseData}: {data: CreateProjectResponse} = await axios.post(url, data, requestConfig)
    return responseData
  } catch (error) {
    throw error
  }
}

export const get = async (currentContext: string, w_id: string): Promise<GetProjectsElemResponse[]> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/workspaces/${w_id}/applications`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data}: {data: GetProjectsElemResponse[]} = await axios.get(url, requestConfig)
    return data
  } catch (error) {
    throw error
  }
}
