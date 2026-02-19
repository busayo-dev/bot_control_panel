/**
 * API Service for WhatsApp Bot Admin Dashboard
 * Handles all communication with the backend API
 */

const API_BASE_URL = 'https://whatsapp-video-bot-slb7.onrender.com/api/admin';

interface ApiResponse<T> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
  [key: string]: any;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

interface BulkMessageRequest {
  message: string;
  target: 'all' | 'subscribers' | 'blocked';
}

interface VideoUpdate {
  video_index: number;
  video_url: string;
  description: string;
}

interface BotResponseUpdate {
  text: string;
}

interface ButtonData {
  responseId: number;
  buttonId: string;
  title: string;
  order?: number;
}

// Get stored token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

// Set token in localStorage
const setToken = (token: string): void => {
  localStorage.setItem('admin_token', token);
};

// Clear token from localStorage
const clearToken = (): void => {
  localStorage.removeItem('admin_token');
};

// Make API request with authentication
const apiRequest = async <T>(
  method: string,
  endpoint: string,
  body?: any
): Promise<ApiResponse<T>> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API calls
export const auth = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiRequest<{ token: string }>(
      'POST',
      '/login',
      credentials
    );
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  logout: () => {
    clearToken();
  },

  changePassword: async (request: ChangePasswordRequest) => {
    return apiRequest('POST', '/change-password', request);
  },

  isAuthenticated: (): boolean => {
    return !!getToken();
  },
};

// Stats API calls
export const stats = {
  getStats: async () => {
    return apiRequest<{
      total_users: number;
      active_subscribers: number;
      blocked_users: number;
      sent_today: number;
      active_24h: number;
      active_1h: number;
    }>('GET', '/stats');
  },
  getChartData: async () => {
    return apiRequest<any[]>('GET', '/chart-data');
  },
};

// User Management API calls
export const users = {
  getUsers: async () => {
    return apiRequest<any[]>('GET', '/users');
  },

  toggleBlock: async (waId: string, block: boolean) => {
    return apiRequest('POST', '/users/toggle-block', { waId, block });
  },
};

// Bulk Messaging API calls
export const messaging = {
  sendBulkMessage: async (request: BulkMessageRequest) => {
    return apiRequest('POST', '/bulk-message', request);
  },
};

// Video Management API calls
export const videos = {
  getVideos: async () => {
    return apiRequest<any[]>('GET', '/videos');
  },

  updateVideo: async (video: VideoUpdate) => {
    return apiRequest('POST', '/videos', video);
  },
  updateAllDescriptions: async (description: string) => {
    return apiRequest('POST', '/videos/update-all-descriptions', {
      description,
    });
  },
};

// Bot Response Management API calls
export const botResponses = {
  getResponses: async () => {
    return apiRequest<any[]>('GET', '/responses');
  },

  updateResponse: async (id: number, update: BotResponseUpdate) => {
    return apiRequest('PUT', `/responses/${id}`, update);
  },
};

// Button Management API calls
export const buttons = {
  addButton: async (button: ButtonData) => {
    return apiRequest('POST', '/buttons', button);
  },

  updateButton: async (id: number, update: Partial<ButtonData>) => {
    return apiRequest('PUT', `/buttons/${id}`, update);
  },

  deleteButton: async (id: number) => {
    return apiRequest('DELETE', `/buttons/${id}`);
  },
};

export default {
  auth,
  stats,
  users,
  messaging,
  videos,
  botResponses,
  buttons,
};
