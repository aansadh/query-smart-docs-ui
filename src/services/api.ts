
const API_BASE_URL = 'http://localhost:8000'; // Update this to your actual API URL

export interface Session {
  id: string;
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

export class ApiService {
  private token: string | null = null;
  private sessionId: string | null = null;

  constructor() {
    this.token = localStorage.getItem('api_token');
    this.sessionId = localStorage.getItem('session_id');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('api_token', token);
  }

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
    localStorage.setItem('session_id', sessionId);
  }

  clearSession() {
    this.sessionId = null;
    localStorage.removeItem('session_id');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (this.sessionId) {
      headers['Session-ID'] = this.sessionId;
    }

    return headers;
  }

  private getFileHeaders(): HeadersInit {
    const headers: HeadersInit = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (this.sessionId) {
      headers['Session-ID'] = this.sessionId;
    }

    return headers;
  }

  async createToken(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/token/new-token`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async createSession(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/session/new-session`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async deleteSession(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/session/delete-session`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    this.clearSession();
    return response.json();
  }

  async uploadText(document: TextDocument): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/ingest/uploadText`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(document),
    });
    return response.json();
  }

  async uploadPdf(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/ingest/uploadPdf`, {
      method: 'POST',
      headers: this.getFileHeaders(),
      body: formData,
    });
    return response.json();
  }

  async deleteFile(fileId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/ingest/deleteFile/${fileId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async askQuery(query: QueryRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/query/askQuery`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(query),
    });
    return response.json();
  }

  async scrapeUrl(scrapeRequest: ScrapeRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/webscrape/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(scrapeRequest),
    });
    return response.json();
  }

  async healthCheck(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return response.json();
  }
}

export const apiService = new ApiService();
