import { AxiosRequestConfig } from 'axios';
export declare class APIClient {
    baseUrl: string;
    baseConfig: {};
    private _http;
    constructor(baseUrl: string, baseConfig?: {});
    get<T>(url: string, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<T>>;
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<T>>;
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<T>>;
    patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<T>>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<T>>;
}
