export interface GetWorkspacesElemResponse{
  workspace_id: string;
  workspace_name: string;
}

export interface GetWorkspacesResponse {
  workspaces: GetWorkspacesElemResponse[];
  current_workspace_id: string;
}

export interface GetCurrentWorkspaceResponse{
  workspace_id: string;
}
