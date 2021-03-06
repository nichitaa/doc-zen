import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Here will be several api methods that does not require caching and could be called without rtk-query
 */
export class DocZenAPI {
  private static _instance: DocZenAPI;
  private readonly API: AxiosInstance;

  private constructor() {
    this.API = axios.create({
      baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL as string,
    });
  }

  public static getInstance = () => {
    if (!DocZenAPI._instance) DocZenAPI._instance = new DocZenAPI();
    return DocZenAPI._instance;
  };

  public getCSRFToken = async (): Promise<string | undefined> => {
    try {
      const config: AxiosRequestConfig = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
      const res = await this.API.get<{ csrfToken: string }>(`/auth-csrf`, config);
      const { csrfToken } = res.data;
      return csrfToken;
    } catch (e) {
      console.log('error on getting csrf token: ', e);
    }
  };

  public downloadDocument = async (
    token: string,
    docId: string,
    pass?: string,
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
      config,
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
    pass?: string,
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
}
