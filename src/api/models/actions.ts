export enum ActionOperation {
  new,
	update,
	delete,
	copy,
}

export interface ActionData {
  operation?:  string;
  display_id?: string;
  set_status?: string;
  name?:       ActionName;
  roles?:      string[];
  is_status_action?: boolean;
  status_id?: string;
}

export interface ActionName {
  en: string;
  ja: string;
}

export interface CreateActionResponse {
  display_id: string;
  action_id:  string;
}

export interface GetActionsElemResponse {
  workspace_id?: string;
  project_id?: string;
  datastore_id?: string;
  action_id: string;
  name: string;
  display_id: string;
  operation: ActionOperation;
  is_status_action: boolean;
  status_id: string;
  set_status: string;
}

export interface GetActionSettingsResponse {
  workspace_id:     string;
  project_id:       string;
  datastore_id:     string;
  action_id:        string;
  status_id?:       string;
  is_status_action: boolean;
  display_id:       string;
  description?:     string;
  search_keys:      string;
  operation:        string;
  set_status:       string;
  name:             ActionName;
  roles: {[key: string]: string | boolean}[];
}
