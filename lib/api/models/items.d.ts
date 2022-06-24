export interface ItemResponse {
    items: ItemResponse;
}
export interface ItemElemResponse {
    i_id: string;
}
export interface StatusListElemResponse {
    status_id: string;
    status_name: string;
}
export interface StatusActionElemResponse {
    action_id: string;
    action_name: string;
    display_order: number;
    crud_type: string;
    next_status_id?: string;
}
export interface ItemDetailResponse {
    title: string;
    rev_no: number;
    field_values: any;
    status_list: StatusListElemResponse[];
    status_actions: StatusActionElemResponse[];
    item_actions: StatusActionElemResponse[];
}
