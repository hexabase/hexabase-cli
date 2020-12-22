import axios from 'axios'
import Conf from 'conf'
import download from 'download'
import fs from 'fs'
import FormData from 'form-data'
import {Context} from '../../base-with-context'

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

export const get = async (currentContext: string): Promise<GetTemplatesCategoryResponse[]> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/templates`
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

export const downloadTemplate = async (currentContext: string, tp_id: string, filename: string): Promise<void> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    // FIXME: delete server
    context.server = 'http://localhost:9000'
    const url = `${context.server}/download_pj_template?tp_id=${tp_id}`
    const token = config.get(`hexabase.${currentContext}.token`)
    const downloadOptions = {
      mode: '666',
      filename: `${filename}.zip`,
      headers: {
        accept: 'application/zip',
        authorization: `Bearer ${token}`,
      },
    }
    await download(url, './', downloadOptions)
  } catch (error) {
    throw error
  }
}

export const uploadTemplate = async (currentContext: string, projectname: string, file: string): Promise<void> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    // FIXME: delete server
    context.server = 'http://localhost:9000'
    const url = `${context.server}/upload_pj_template`
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
