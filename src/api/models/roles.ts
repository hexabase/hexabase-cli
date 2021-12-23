export interface GetProjectRolesElemResponse {
  display_id: string;
  name:       string;
  project_id: string;
  role_id:    string;
  type:       string;
}

export interface GetRoleDatastoreSetting {
  id:    string;
  name:       string;
  display_id: string;
}

export interface Role {
  _key: string;
  id:    string;
  name:       string;
  project_id: string;
  display_id: string;
  r_id: string;
  type: string;
  access_key: string;
  canExecute: boolean;
  created_at: string;
}
