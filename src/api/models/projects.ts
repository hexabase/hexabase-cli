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

export interface TemplateForm{
  name: string;
  category: string;
  description: string;
}
