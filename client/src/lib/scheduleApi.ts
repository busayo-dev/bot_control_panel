/**
 * Schedule API Service for WhatsApp Bot Admin Dashboard
 * Handles all communication with the schedule endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ApiResponse<T> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
  [key: string]: any;
}

interface ScheduleData {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  availabilityType: 'ALWAYS' | 'NEVER' | 'CUSTOM';
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format
  unavailableMessage?: string;
}

interface AvailabilityStatus {
  isAvailable: boolean;
  schedule: ScheduleData | null;
  message: string | null;
}

// Get stored token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('admin_token');
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

// Schedule API calls
export const schedule = {
  /**
   * Check current bot availability status
   */
  checkAvailability: async (): Promise<AvailabilityStatus> => {
    return apiRequest<AvailabilityStatus>('GET', '/schedule/check');
  },

  /**
   * Get all schedules for the week
   */
  getAllSchedules: async (): Promise<ScheduleData[]> => {
    return apiRequest<ScheduleData[]>('GET', '/schedule/all');
  },

  /**
   * Get schedule for a specific day
   */
  getScheduleForDay: async (dayOfWeek: number): Promise<ScheduleData> => {
    return apiRequest<ScheduleData>('GET', `/schedule/${dayOfWeek}`);
  },

  /**
   * Update or create a schedule for a specific day
   */
  updateSchedule: async (dayOfWeek: number, scheduleData: Partial<ScheduleData>): Promise<{ success: boolean; schedule: ScheduleData }> => {
    return apiRequest('PUT', `/schedule/${dayOfWeek}`, scheduleData);
  },

  /**
   * Initialize default schedules for all days
   */
  initializeSchedules: async (): Promise<{ success: boolean; schedules: ScheduleData[] }> => {
    return apiRequest('POST', '/schedule/initialize');
  },

  /**
   * Bulk update multiple schedules at once
   */
  bulkUpdateSchedules: async (schedules: ScheduleData[]): Promise<{ success: boolean; schedules: ScheduleData[] }> => {
    return apiRequest('POST', '/schedule/bulk-update', { schedules });
  },
};

export default schedule;
