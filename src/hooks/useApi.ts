
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
      console.log('Starting API request process...');
      
      // Get the token first and wait for it
      const token = await getToken();
      console.log('Token retrieved:', token ? 'Token exists' : 'No token');
      console.log('Token length:', token ? token.length : 'N/A');
      
      // Get session ID
      const sessionId = config.sessionId || localStorage.getItem('current_session_id');
      console.log('Session ID:', sessionId ? sessionId : 'No session ID');

      // Build headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add Authorization header with Bearer token if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Authorization header added with Bearer token');
      } else {
        console.warn('No token available for Authorization header');
      }

      // Add Session-ID header if sessionId exists
      if (sessionId) {
        headers['Session-ID'] = sessionId;
        console.log('Session-ID header added:', sessionId);
      } else {
        console.warn('No session ID available for Session-ID header');
      }

      // Merge with any custom headers
      const finalHeaders = {
        ...headers,
        ...config.headers,
      };

      const axiosConfig: AxiosRequestConfig = {
        ...config,
        baseURL: API_BASE_URL,
        headers: finalHeaders,
      };

      console.log('Final request config:', {
        url: axiosConfig.url,
        method: axiosConfig.method,
        headers: axiosConfig.headers,
        baseURL: axiosConfig.baseURL
      });

      const response = await axios(axiosConfig);
      console.log('Request successful:', response.status);
      return response;
    } catch (error) {
      console.error('Error in makeRequest:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        console.error('Response headers:', error.response?.headers);
      }
      throw error;
    }
  }, [getToken]);

  return { makeRequest };
};
