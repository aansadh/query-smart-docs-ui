
import { useAuth } from '@clerk/clerk-react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export interface ApiRequestConfig extends Omit<AxiosRequestConfig, 'baseURL'> {
  sessionId?: string;
  headers?: Record<string, string>;
}

export const useApi = () => {
  const { getToken } = useAuth();

  const makeRequest = useCallback(async <T = any>(
    config: ApiRequestConfig
  ): Promise<AxiosResponse<T>> => {
    try {
      // Get the token first
      const token = await getToken();
      console.log('Token retrieved:', token ? 'Token exists' : 'No token');
      
      const sessionId = config.sessionId || localStorage.getItem('current_session_id');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add Authorization header with Bearer token if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Authorization header added');
      }

      // Add Session-ID header if sessionId exists
      if (sessionId) {
        headers['Session-ID'] = sessionId;
        console.log('Session-ID header added:', sessionId);
      }

      const axiosConfig: AxiosRequestConfig = {
        ...config,
        baseURL: API_BASE_URL,
        headers: {
          ...headers,
          ...config.headers,
        },
      };

      console.log('Making request with config:', {
        url: axiosConfig.url,
        method: axiosConfig.method,
        headers: axiosConfig.headers
      });

      return axios(axiosConfig);
    } catch (error) {
      console.error('Error in makeRequest:', error);
      throw error;
    }
  }, [getToken]);

  return { makeRequest };
};
