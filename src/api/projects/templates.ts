import axios, {AxiosRequestConfig} from 'axios'
import Conf from 'conf'

interface GetTemplatesTemplateResponse{
  tp_id: string;
  name: string;
  description: string;
}

interface GetTemplatesCategoryResponse{
  category: string;
  templates: GetTemplatesTemplateResponse[];
}

interface GetTemplatesResponse{
  enabled: boolean;
  categories: GetTemplatesCategoryResponse[];
}

const config = new Conf()

export const get = async (server: string): Promise<GetTemplatesCategoryResponse[]> => {
  const url = `${server}/api/v0/templates`
  try {
    const currentContext = config.get('current-context')
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig: AxiosRequestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data}: {data: GetTemplatesResponse} = await axios.get(url, requestConfig)
    return data.categories
  } catch (error) {
    throw error
  }
}
