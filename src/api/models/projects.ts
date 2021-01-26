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
