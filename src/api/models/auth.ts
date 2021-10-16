export interface PostLoginResponse {
  token: string;
}

export interface GetUserInfoResponse {
  u_id: string;
  username: string;
  email: string;
  profile_pic: string;
  current_workspace_id: string;
  is_ws_admin: boolean;
  user_roles: { [key: string]: string | number }[];
  user_groups: { [key: string]: string }[];
}
