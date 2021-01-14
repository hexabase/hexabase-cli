import axios from 'axios'
import Conf from 'conf'
import {Context} from '../../base-with-context'

export interface CreateFieldData {
  name:      FieldName;
  dataType:  string;
  as_title:  boolean;
  search:    boolean;
  show_list: boolean;
  full_text: boolean;
  unique:    boolean;
  roles:     string[];
}

export interface FieldName {
  en: string;
  ja: string;
}

interface CreateFieldResponse {
  dataType:  string;
  display_id: string;
  field_id:  string;
}

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

export const create = async (currentContext: string, datastoreId: string, data: CreateFieldData): Promise<CreateFieldResponse> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/datastores/${datastoreId}/fields`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data: responseData}: {data: CreateFieldResponse} = await axios.post(url, data, requestConfig)
    return responseData
  } catch (error) {
    throw error
  }
}

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
