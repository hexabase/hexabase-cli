import { StatusSetting } from './statuses';
import { GetRoleDatastoreSetting } from './roles';
import { FieldDatastoreSetting, FieldLayoutDatastoreSetting } from './fields';
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
export interface GetDatastoreSetting {
    id: string;
    w_id: string;
    p_id: string;
    names: string;
    display_id: string;
    fields?: [FieldDatastoreSetting];
    field_layout?: [FieldLayoutDatastoreSetting];
    roles?: [GetRoleDatastoreSetting];
    statuses?: [StatusSetting];
}
export interface Datastore {
    d_id: string;
    p_id: string;
    w_id: string;
    ws_name: string;
    name: string;
    uploading: boolean;
    imported: boolean;
    no_status: boolean;
    show_in_menu: boolean;
    deleted: boolean;
    display_order: number;
    display_id: boolean;
    show_only_dev_mode: boolean;
    use_qr_download: boolean;
    use_csv_update: boolean;
    use_external_sync: boolean;
    use_replace_upload: boolean;
    unread: number;
    invisible: boolean;
    use_grid_view: boolean;
    use_grid_view_by_default: boolean;
    use_board_view: boolean;
    data_source: string;
    is_external_service: boolean;
    external_service_data: any;
    show_display_id_to_list: boolean;
    show_info_to_list: boolean;
}
