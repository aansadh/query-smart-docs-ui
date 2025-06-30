
import { useAuth } from '@clerk/clerk-react';

const API_BASE_URL = 'http://localhost:8000';

export interface Session {
  _id: string;
  user_id: string;
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

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
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

  private async getFileHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {};

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
    const response = await fetch(`${API_BASE_URL}/token/new-token`, {
      method: 'POST',
      headers: await this.getHeaders(),
    });
    return response.json();
  }

  async createSession(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/session/new-session`, {
      method: 'POST',
      headers: await this.getHeaders(),
    });
    return response.json();
  }

  async getSessions(): Promise<Session[]> {
    const response = await fetch(`${API_BASE_URL}/session/get-sessions`, {
      method: 'GET',
      headers: await this.getHeaders(),
    });
    return response.json();
  }

  async deleteSession(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/session/delete-session`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    });
    this.clearSession();
    return response.json();
  }

  async uploadText(document: TextDocument): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/ingest/upload-text`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(document),
    });
    return response.json();
  }

  async uploadPdf(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/ingest/upload-pdf`, {
      method: 'POST',
      headers: await this.getFileHeaders(),
      body: formData,
    });
    return response.json();
  }

  async getFiles(): Promise<FileInfo[]> {
    const response = await fetch(`${API_BASE_URL}/file/`, {
      method: 'GET',
      headers: await this.getHeaders(),
    });
    return response.json();
  }

  async deleteFile(fileId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/ingest/delete-file/${fileId}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    });
    return response.json();
  }

  async askQuery(query: QueryRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/query/askQuery`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(query),
    });
    return response.json();
  }

  async scrapeUrl(scrapeRequest: ScrapeRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/webscrape/`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(scrapeRequest),
    });
    return response.json();
  }

  async healthCheck(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: await this.getHeaders(),
    });
    return response.json();
  }
}

export const apiService = new ApiService();
