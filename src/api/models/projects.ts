import { Datastores, Datastore } from './datastores'
export interface CreateProjectData{
  name: ProjectName;
  tp_id?: string;
}

export interface ProjectName{
  en: string;
  ja: string;
}

export interface CreateProjectResponse {
  project_id: string;
}

export interface GetProjectsElemResponse {
  application_id: string;
  name: string;
  display_id: string;
}

export interface CreateNewProjectTemplateData{
  project_id: string;
  name: string;
  category: string;
  description: string;
  include_histories: boolean;
}

export interface CreateNewProjectTemplateResponse {
  stream_id: string;
  tp_id: string;
}

export interface UploadProjectTemplateResponse {
  stream_id: string;
}

export interface TemplateForm{
  name: string;
  category: string;
  description: string;
}

export interface ProjectSettings {
  id?: string;
  workspace_id?: string;
  application_id: string;
  name?: string;
  names?: ProjectName;
  display_id: string;
  roles?: {[key: string]: string | boolean}[];
  datastores?: [Datastores];
}

export interface ProjectInfo {
  p_id: string;
  workspace_id: string;
  name: string | ProjectName;
  display_id: string;
  template_id: string;
  display_order: number;
}
export interface ProjectDatastoreInfo {
  project: ProjectInfo;
  datastore: Datastore;
}
