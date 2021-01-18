import axios from 'axios'
import Conf from 'conf'
import {Context} from '../../base-with-context'

interface GetDatastoresElemResponse {
  datastore_id: string;
  name: string;
  display_id: string;
  deleted: boolean;
  imported: boolean;
  uploading: boolean;
}

const config = new Conf()

export const get = async (currentContext: string, p_id: string): Promise<GetDatastoresElemResponse[]> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/applications/${p_id}/datastores`
    const token = config.get(`hexabase.${currentContext}.token`)
    const requestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const {data}: {data: GetDatastoresElemResponse[]} = await axios.get(url, requestConfig)
    return data
  } catch (error) {
    throw error
  }
}
