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