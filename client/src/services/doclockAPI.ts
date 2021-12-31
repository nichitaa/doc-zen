import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

/**
 * Here will be several api methods that does not require caching and could be called without rtk-query
 */
export class DoclockAPI {
  private static _instance: DoclockAPI;
  private readonly API: AxiosInstance;

  private constructor() {
    this.API = axios.create({
      baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL as string,
    });
  }

  public downloadDocument = async (
    token: string,
    docId: string,
    pass?: string
  ): Promise<{ file: Blob; filename: string; error?: string }> => {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      validateStatus: (s) => s <= 500,
      responseType: 'blob',
    };
    const queryParam = pass ? `?pass=${pass}` : ``;
    const res = await this.API.get(
      `/document/download/${docId}${queryParam}`,
      config
    );
    if (res.status !== 200) return JSON.parse(await res.data.text());
    return {
      file: res.data,
      filename: res.headers.filename,
    };
  };

  public downloadSharedDocument = async (
    token: string,
    refId: string,
    pass?: string
  ): Promise<{ file: Blob; filename: string; error?: string }> => {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      validateStatus: (s) => s <= 500,
      responseType: 'blob',
    };

    let queryParam = `?refId=${refId}${pass ? `&pass=${pass}` : ''}`;

    const res = await this.API.get(`/shared${queryParam}`, config);
    if (res.status !== 200) return JSON.parse(await res.data.text());
    return {
      file: res.data,
      filename: res.headers.filename,
    };
  };

  public static getInstance = () => {
    if (!DoclockAPI._instance) DoclockAPI._instance = new DoclockAPI();
    return DoclockAPI._instance;
  };
}
