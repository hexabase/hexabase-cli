import axios, {AxiosRequestConfig} from 'axios'
import Conf from 'conf'

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

const config = new Conf()

export const create = async (server: string, data: CreateProjectData): Promise<CreateProjectResponse> => {
  const url = `${server}/api/v0/applications`
  try {
    const currentContext = config.get('current-context')
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig: AxiosRequestConfig = {
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
