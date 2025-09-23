// API client for contacts backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  count?: number;
}

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new ApiError(response.status, errorData.message || response.statusText, errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or other errors
    throw new ApiError(0, 'Network error or server unavailable', error);
  }
}

export const apiClient = {
  // Get all contacts
  async getContacts(search?: string): Promise<ApiResponse<ContactRecord[]>> {
    const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest<ApiResponse<ContactRecord[]>>(`/contacts${searchParam}`);
  },

  // Get contact by ID
  async getContact(id: string): Promise<ApiResponse<ContactRecord>> {
    return apiRequest<ApiResponse<ContactRecord>>(`/contacts/${id}`);
  },

  // Create new contact
  async createContact(contact: Partial<ContactRecord>): Promise<ApiResponse<ContactRecord>> {
    return apiRequest<ApiResponse<ContactRecord>>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  },

  // Update contact
  async updateContact(id: string, contact: Partial<ContactRecord>): Promise<ApiResponse<ContactRecord>> {
    return apiRequest<ApiResponse<ContactRecord>>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contact),
    });
  },

  // Delete contact
  async deleteContact(id: string): Promise<ApiResponse<ContactRecord>> {
    return apiRequest<ApiResponse<ContactRecord>>(`/contacts/${id}`, {
      method: 'DELETE',
    });
  },

  // Toggle favorite
  async toggleFavorite(id: string): Promise<ApiResponse<ContactRecord>> {
    return apiRequest<ApiResponse<ContactRecord>>(`/contacts/${id}/favorite`, {
      method: 'PATCH',
    });
  },

  // Health check
  async healthCheck(): Promise<any> {
    const url = `${API_BASE_URL.replace('/api', '')}/health`;
    return fetch(url).then(res => res.json());
  },
};

// Contact type matching backend schema
export interface ContactRecord {
  id: string;
  first: string;
  last: string;
  email: string;
  twitter?: string;
  avatar?: string;
  notes?: string;
  favorite: boolean;
}