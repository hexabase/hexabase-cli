import axios from 'axios'
import Conf from 'conf'
import {Context} from '../../base-with-context'

export interface GetFieldsElemResponse {
  field_id: string;
  name: string;
  display_id: string;
  dataType: string;
  fieldIndex: number;
}

interface GetFieldsResponse {
  fields: {[key: string]: GetFieldsElemResponse};
}

const config = new Conf()

export const get = async (currentContext: string, d_id: string): Promise<GetFieldsResponse> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/datastores/${d_id}/fields`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data}: {data: GetFieldsResponse} = await axios.get(url, requestConfig)
    return data
  } catch (error) {
    throw error
  }
}
