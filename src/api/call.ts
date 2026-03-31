import axios from 'axios';
import type { AxiosRequestConfig, Method } from 'axios';

const BASE_URL = 'https://front-school-strapi.ktsdev.ru/api';

type CallParams = {
  endpoint: string;
  method?: Method;
  data?: any;
  params?: Record<string, any>;
  withAuth?: boolean;
  token?: string;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

type CallResponse<T> = {
  isError: boolean;
  data: T | null;
  error: string | null;
  status: number | null;
};

export async function call<T = any>({
  endpoint,
  method = 'GET',
  data,
  params,
  withAuth = false,
  token,
  signal,
  headers = {},
}: CallParams): Promise<CallResponse<T>> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

    const authToken = token || (withAuth ? localStorage.getItem('jwt') : null);

    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      params,
      signal,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
    };

    const response = await axios(config);

    return {
      isError: false,
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      isError: true,
      data: null,
      error: error.response?.data?.error?.message || error.message || 'Unknown error',
      status: error.response?.status || null,
    };
  }
}
