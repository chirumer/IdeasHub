import type { User, HackathonIdea, AppSettings } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Important for session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<{ user: User }> => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  logout: async (): Promise<void> => {
    await apiCall('/auth/logout', { method: 'POST' });
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    return apiCall('/auth/me');
  },
};

// Ideas API
export const ideasAPI = {
  getAll: async (): Promise<HackathonIdea[]> => {
    return apiCall('/ideas');
  },

  getById: async (id: string): Promise<HackathonIdea> => {
    return apiCall(`/ideas/${id}`);
  },

  upload: async (file: File): Promise<{ message: string; idea: HackathonIdea; requiresApproval: boolean }> => {
    const formData = new FormData();
    formData.append('zip', file);

    const response = await fetch(`${API_BASE_URL}/ideas/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  generate: async (description: string, ideaType: string, file?: File): Promise<{ message: string; idea: HackathonIdea; requiresApproval: boolean }> => {
    const formData = new FormData();
    
    formData.append('ideaType', ideaType);
    
    if (file) {
      formData.append('file', file);
    } else {
      formData.append('description', description);
    }

    const response = await fetch(`${API_BASE_URL}/ideas/generate`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Generation failed' }));
      throw new Error(error.error || 'Generation failed');
    }

    return response.json();
  },

  updateApproval: async (id: string, approved: boolean): Promise<{ message: string; idea: HackathonIdea }> => {
    return apiCall(`/ideas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ approved }),
    });
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiCall(`/ideas/${id}`, { method: 'DELETE' });
  },

  addPage: async (id: string, title: string, description: string): Promise<{ message: string; page: { title: string; filename: string } }> => {
    return apiCall(`/ideas/${id}/pages`, {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  },

  deletePage: async (id: string, filename: string): Promise<{ message: string }> => {
    return apiCall(`/ideas/${id}/pages/${filename}`, { method: 'DELETE' });
  },

  downloadContextFile: (): string => {
    return `${API_BASE_URL}/ideas/context-file`;
  },
};

// Settings API
export const settingsAPI = {
  get: async (): Promise<AppSettings> => {
    return apiCall('/ideas/settings/app');
  },

  update: async (settings: AppSettings): Promise<{ message: string; settings: AppSettings }> => {
    return apiCall('/ideas/settings/app', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};
