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

export interface CreateFieldResponse {
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

export interface GetFieldsResponse {
  fields: {[key: string]: GetFieldsElemResponse};
}

export interface GetFieldSettingsResponse {
  workspace_id: string;
  project_id:   string;
  datastore_id: string;
  field_id:     string;
  name: FieldName;
  display_id: string;
  data_type: string;
  search: boolean;
  show_list: boolean;
  as_title: boolean;
  status: boolean;
  full_text: boolean;
  unique: boolean;
  hide_on_input: boolean;
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

export interface FieldDatastoreSetting {
  id: string,
  display_name: string,
  display_id: string,
  name: FieldName,
  data_type: string,
  search: boolean,
  show_list: boolean,
  as_title: boolean,
  status: boolean,
  field_id?: number,
  title_order?: number,
  full_text?: boolean,
  unique?: boolean,
  min_value?: string,
  max_value?: string,
}
export interface FieldLayoutDatastoreSetting {
  id: string,
  display_id: string,
  col: number,
  row: number,
  size_x: number,
  size_y: number,
}

export interface ActionFieldSetting {
  id: string,
  display_id: string,
  names: FieldName,
  show: boolean,
  update: boolean,
  mandatory: boolean,
}
