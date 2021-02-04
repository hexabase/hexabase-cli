import axios, {AxiosRequestConfig} from 'axios'

export class APIClient {
  private _http: typeof axios;

  constructor(public baseUrl: string, public baseConfig = {}) {
    this._http = axios
  }

  get<T>(url: string, config: AxiosRequestConfig = {}) {
    return this._http.get<T>(`${this.baseUrl}${url}`, {...this.baseConfig, ...config})
  }

  post<T>(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    return this._http.post<T>(`${this.baseUrl}${url}`, data, {...this.baseConfig, ...config})
  }

  put<T>(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    return this._http.put<T>(`${this.baseUrl}${url}`, data, {...this.baseConfig, ...config})
  }

  patch<T>(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    return this._http.patch<T>(`${this.baseUrl}${url}`, data, {...this.baseConfig, ...config})
  }

  delete<T>(url: string, config: AxiosRequestConfig = {}) {
    return this._http.delete<T>(`${this.baseUrl}${url}`, {...this.baseConfig, ...config})
  }
}
