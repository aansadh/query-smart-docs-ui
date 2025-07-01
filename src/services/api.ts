import { useAuth } from '@clerk/clerk-react';
import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface Session {
  _id: string;
  user_id: string;
  session_name?: string;
  created_at: string;
}

export interface TextDocument {
  text: string;
  file_name: string;
  created_at?: string;
}

export interface QueryRequest {
  query: string;
}

export interface ScrapeRequest {
  url: string;
}

export interface FileInfo {
  id: string;
  name: string;
  type: string;
  created_at: string;
  size?: string;
}

export interface CreateSessionRequest {
  session_name?: string;
}

export class ApiService {
  private getToken: (() => Promise<string | null>) | null = null;
  private sessionId: string | null = null;

  constructor() {
    this.sessionId = localStorage.getItem('current_session_id');
  }

  setAuth(getToken: () => Promise<string | null>) {
    this.getToken = getToken;
  }

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
    localStorage.setItem('current_session_id', sessionId);
  }

  clearSession() {
    this.sessionId = null;
    localStorage.removeItem('current_session_id');
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.getToken) {
      const token = await this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    if (this.sessionId) {
      headers['Session-ID'] = this.sessionId;
    }

    return headers;
  }

  private async getFileHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};

    if (this.getToken) {
      const token = await this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    if (this.sessionId) {
      headers['Session-ID'] = this.sessionId;
    }

    return headers;
  }

  async createToken(): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.post(`${API_BASE_URL}/token/new-token`, {}, { headers });
    return response.data;
  }

  async createSession(sessionName: string): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.post(`${API_BASE_URL}/session/new-session`, null, { 
      headers,
      params: { session_name: sessionName }
    });
    return response.data;
  }

  async getSessions(): Promise<Session[]> {
    const headers = await this.getHeaders();
    const response = await axios.get(`${API_BASE_URL}/session/get-sessions`, { headers });
    return response.data;
  }

  async deleteSession(): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.delete(`${API_BASE_URL}/session/delete-session`, { headers });
    this.clearSession();
    return response.data;
  }

  async uploadText(document: TextDocument): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.post(`${API_BASE_URL}/ingest/upload-text`, document, { headers });
    return response.data;
  }

  async uploadPdf(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = await this.getFileHeaders();
    const response = await axios.post(`${API_BASE_URL}/ingest/upload-pdf`, formData, { headers });
    return response.data;
  }

  async getFiles(): Promise<FileInfo[]> {
    const headers = await this.getHeaders();
    const response = await axios.get(`${API_BASE_URL}/file/`, { headers });
    return response.data;
  }

  async deleteFile(fileId: string): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.delete(`${API_BASE_URL}/ingest/delete-file/${fileId}`, { headers });
    return response.data;
  }

  async askQuery(query: QueryRequest): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.post(`${API_BASE_URL}/query/askQuery`, query, { headers });
    return response.data;
  }

  async scrapeUrl(scrapeRequest: ScrapeRequest): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.post(`${API_BASE_URL}/webscrape/`, scrapeRequest, { headers });
    return response.data;
  }

  async healthCheck(): Promise<any> {
    const headers = await this.getHeaders();
    const response = await axios.get(`${API_BASE_URL}/`, { headers });
    return response.data;
  }
}

export const apiService = new ApiService();
