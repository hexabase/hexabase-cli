import {StatusSetting} from './statuses'
import {GetRoleDatastoreSetting} from './roles'
import {FieldDatastoreSetting, FieldLayoutDatastoreSetting} from './fields'
export interface GetDatastoresElemResponse {
  datastore_id: string;
  name: string;
  display_id: string;
  deleted: boolean;
  imported: boolean;
  uploading: boolean;
}
export interface Datastores {
  datastore_id: string;
  name: string;
  display_id: string;
}
export interface GetDatastoresInWorkSpaceResponse {
  application_id: string;
  name: string;
  display_id: string;
  datastores?: Datastores[];
}

export interface GetDatastoreSetting {
  id: string;
  w_id: string;
  p_id: string;
  name: string;
  display_id: string;
  fields?: [FieldDatastoreSetting];
  field_layout?: [FieldLayoutDatastoreSetting];
  roles?: [GetRoleDatastoreSetting];
  statuses?: [StatusSetting];
}
