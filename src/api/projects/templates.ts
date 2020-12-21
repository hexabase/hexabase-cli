import axios from 'axios'
import Conf from 'conf'
import download from 'download'

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
    const requestConfig = {
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

export const downloadTemplate = async (server: string, tp_id: string, filename: string): Promise<void> => {
  const url = `${server}/v1/api/download_pj_template?tp_id=${tp_id}`
  const currentContext = config.get('current-context')
  const token = config.get(`hexabase.${currentContext}.token`)
  const downloadOptions = {
    mode: '666',
    filename: `${filename}.zip`,
    headers: {
      accept: 'application/zip',
      authorization: `Bearer ${token}`,
    },
  }
  try {
    await download(url, './', downloadOptions)
  } catch (error) {
    throw error
  }
}
