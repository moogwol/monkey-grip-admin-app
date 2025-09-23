////////////////////////////////////////////////////////////////////////////////
// API-based data layer for contacts
// Replaced fake database with real API calls to backend
////////////////////////////////////////////////////////////////////////////////

import { apiClient, type ContactRecord } from "./api";

// Contact type for frontend (mapped from backend)
export type ContactMutation = {
  id?: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
  email?: string;
};

// Legacy contact record type for compatibility
export type { ContactRecord };

// Helper function to transform backend contact to frontend format
function transformContactFromApi(apiContact: ContactRecord): ContactRecord & {
  first: string;
  last: string;
} {
  return {
    ...apiContact,
    first: apiContact.first_name || '',
    last: apiContact.last_name || '',
  };
}

// Helper function to transform frontend contact to backend format
function transformContactToApi(contact: ContactMutation): Partial<ContactRecord> {
  return {
    first_name: contact.first || '',
    last_name: contact.last || '',
    email: contact.email || '',
    twitter: contact.twitter || '',
    avatar: contact.avatar || '',
    notes: contact.notes || '',
    favorite: contact.favorite || false,
  };
}

////////////////////////////////////////////////////////////////////////////////
// API wrapper functions to maintain existing interface
export async function getContacts(query?: string | null) {
  try {
    const response = await apiClient.getContacts(query || undefined);
    if (response.success && response.data) {
      return response.data.map(transformContactFromApi);
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return [];
  }
}

export async function createEmptyContact() {
  try {
    // Generate a unique placeholder email to avoid conflicts
    const timestamp = Date.now();
    const response = await apiClient.createContact({
      first_name: 'New',
      last_name: 'Contact',
      email: `contact${timestamp}@example.com`,
    });
    if (response.success && response.data) {
      return transformContactFromApi(response.data);
    }
    throw new Error(response.message || 'Failed to create contact');
  } catch (error) {
    console.error('Failed to create contact:', error);
    throw error;
  }
}

export async function getContact(id: string) {
  try {
    console.log('Fetching contact with ID:', id);
    const response = await apiClient.getContact(id);
    console.log('API response:', response);
    if (response.success && response.data) {
      const transformed = transformContactFromApi(response.data);
      console.log('Transformed contact:', transformed);
      return transformed;
    }
    console.log('Contact not found or API returned error:', response.message);
    return null;
  } catch (error) {
    console.error('Failed to fetch contact:', error);
    return null;
  }
}

export async function updateContact(id: string, updates: ContactMutation) {
  try {
    const apiUpdates = transformContactToApi(updates);
    const response = await apiClient.updateContact(id, apiUpdates);
    if (response.success && response.data) {
      return transformContactFromApi(response.data);
    }
    throw new Error(response.message || 'Failed to update contact');
  } catch (error) {
    console.error('Failed to update contact:', error);
    throw error;
  }
}

export async function deleteContact(id: string) {
  try {
    const response = await apiClient.deleteContact(id);
    if (response.success) {
      return;
    }
    throw new Error(response.message || 'Failed to delete contact');
  } catch (error) {
    console.error('Failed to delete contact:', error);
    throw error;
  }
}

export async function toggleFavorite(id: string) {
  try {
    const response = await apiClient.toggleFavorite(id);
    if (response.success && response.data) {
      return transformContactFromApi(response.data);
    }
    throw new Error(response.message || 'Failed to toggle favorite');
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
    throw error;
  }
}
