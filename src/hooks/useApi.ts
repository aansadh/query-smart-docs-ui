
import { useAuth } from '@clerk/clerk-react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export interface ApiRequestConfig extends Omit<AxiosRequestConfig, 'headers'> {
  sessionId?: string;
}

export const useApi = () => {
  const { getToken } = useAuth();

  const makeRequest = useCallback(async <T = any>(
    config: ApiRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const token = await getToken();
    const sessionId = config.sessionId || localStorage.getItem('current_session_id');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (sessionId) {
      headers['Session-ID'] = sessionId;
    }

    const axiosConfig: AxiosRequestConfig = {
      ...config,
      baseURL: API_BASE_URL,
      headers: {
        ...headers,
        ...config.headers,
      },
    };

    return axios(axiosConfig);
  }, [getToken]);

  return { makeRequest };
};
