import axios from 'axios'
import Conf from 'conf'
import fs from 'fs'
import FormData from 'form-data'
import {Context} from '../../base-with-context'

export interface GetTemplatesTemplateResponse{
  tp_id: string;
  name: string;
  description: string;
}

export interface GetTemplatesCategoryElemResponse{
  category: string;
  templates: GetTemplatesTemplateResponse[];
}

export interface GetTemplatesCategoryResponse{
  enabled: boolean;
  categories: GetTemplatesCategoryElemResponse[];
}

const config = new Conf()

export const get = async (currentContext: string): Promise<GetTemplatesCategoryElemResponse[]> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/templates`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data}: {data: GetTemplatesCategoryResponse} = await axios.get(url, requestConfig)
    return data.categories
  } catch (error) {
    throw error
  }
}

export const uploadTemplate = async (currentContext: string, projectname: string, file: string): Promise<void> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/templates/upload`
    const token = config.get(`hexabase.${currentContext}.token`)

    const form = new FormData()
    form.append('file', fs.createReadStream(file))
    form.append('name', projectname)

    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
    }

    await axios.post(url, form, requestConfig)
  } catch (error) {
    throw error
  }
}
