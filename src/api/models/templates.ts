export interface GetTemplatesTemplateResponse{
  tp_id: string;
  name: string;
  description: string;
}

export interface GetTemplatesCategoryElemResponse{
  category: string;
  templates: GetTemplatesTemplateResponse[];
}

export interface GetTemplatesCategoryResponse{
  enabled: boolean;
  categories: GetTemplatesCategoryElemResponse[];
}
