import axios from 'axios'
import Conf from 'conf'
import {Context} from '../../base-with-context'

export interface FieldData {
  name?:        FieldName;
  display_id?:  string;
  dataType?:    string;
  as_title?:    boolean;
  search?:      boolean;
  show_list?:   boolean;
  full_text?:   boolean;
  unique?:      boolean;
  hideOnInput?: boolean;
  roles?:       string[];
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

interface GetFieldSettingsResponse {
  workspace_id: string;
  project_id:   string;
  datastore_id: string;
  field_id:     string;
  name: FieldName;
  display_id: string;
  dataType: string;
  search: boolean;
  show_list: boolean;
  as_title: boolean;
  status: boolean;
  full_text: boolean;
  unique: boolean;
  hideOnInput: boolean;
  min_value?: string;
  max_value?: string;
  roles: {[key: string]: string | boolean}[];
  dslookup_info?: {[key: string]: string};
  users_info?: {[key: string]: boolean | {[key: string]: string}[]};
  autonum_info?: {[key: string]: string | number};
  num_info?: {[key: string]: string | boolean};
  calc_info?: {[key: string]: string | string[] | boolean};
  file_info?: {[key: string]: boolean};
}

const config = new Conf()

export const create = async (currentContext: string, d_id: string, data: FieldData): Promise<CreateFieldResponse> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/datastores/${d_id}/fields`
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

export const getOne = async (currentContext: string, d_id: string, f_id: string): Promise<GetFieldSettingsResponse> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/datastores/${d_id}/fields/${f_id}`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data}: {data: GetFieldSettingsResponse} = await axios.get(url, requestConfig)
    return data
  } catch (error) {
    throw error
  }
}

export const update = async (currentContext: string, d_id: string, f_id: string, data: FieldData): Promise<void> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/datastores/${d_id}/fields/${f_id}`
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

export const del = async (currentContext: string, d_id: string, f_id: string): Promise<void> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/datastores/${d_id}/fields/${f_id}`
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
