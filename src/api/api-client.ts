import axios, {AxiosRequestConfig} from 'axios'

export class APIClient {
  private _http: typeof axios;

  private _authConfig = {}

  constructor(private baseUrl: string, token: string) {
    this._http = axios
    this._authConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  }

  get<T>(url: string, config: AxiosRequestConfig = {}) {
    return this._http.get<T>(`${this.baseUrl}${url}`, {...this._authConfig, ...config})
  }

  post<T>(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    return this._http.post<T>(`${this.baseUrl}${url}`, data, {...this._authConfig, ...config})
  }

  put<T>(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    return this._http.put<T>(`${this.baseUrl}${url}`, data, {...this._authConfig, ...config})
  }

  patch<T>(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    return this._http.patch<T>(`${this.baseUrl}${url}`, data, {...this._authConfig, ...config})
  }

  delete<T>(url: string, config: AxiosRequestConfig = {}) {
    return this._http.delete<T>(`${this.baseUrl}${url}`, {...this._authConfig, ...config})
  }
}
