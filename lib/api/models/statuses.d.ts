import { Action } from './actions';
export interface StatusName {
    en: string;
    ja: string;
}
export interface GetStatusesElemResponse {
    status_id: string;
    display_id: string;
    name: string;
    displayed_name: string;
    sort_id: number;
    x: number;
    y: number;
}
export interface StatusSetting {
    id: string;
    display_id: string;
    names: StatusName;
}
export interface Status {
    id: string;
    display_id: string;
    names: StatusName;
    status_actions: [Action];
}
