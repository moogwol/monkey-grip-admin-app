// API client for BJJ Club Management System
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

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
  // Members Management
  async getMembers(search?: string): Promise<ApiResponse<MemberRecord[]>> {
    const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest<ApiResponse<MemberRecord[]>>(`/members${searchParam}`);
  },

  async getMember(id: string): Promise<ApiResponse<MemberRecord>> {
    return apiRequest<ApiResponse<MemberRecord>>(`/members/${id}`);
  },

  async createMember(member: Partial<MemberRecord>): Promise<ApiResponse<MemberRecord>> {
    return apiRequest<ApiResponse<MemberRecord>>('/members', {
      method: 'POST',
      body: JSON.stringify(member),
    });
  },

  async updateMember(id: string, member: Partial<MemberRecord>): Promise<ApiResponse<MemberRecord>> {
    return apiRequest<ApiResponse<MemberRecord>>(`/members/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(member),
    });
  },

  async deleteMember(id: string): Promise<ApiResponse<MemberRecord>> {
    return apiRequest<ApiResponse<MemberRecord>>(`/members/${id}`, {
      method: 'DELETE',
    });
  },

  // BJJ-specific member operations
  async promoteMember(id: string, newBelt: string, newStripes: number): Promise<ApiResponse<MemberRecord>> {
    return apiRequest<ApiResponse<MemberRecord>>(`/members/${id}/promote`, {
      method: 'PATCH',
      body: JSON.stringify({ belt_rank: newBelt, stripes: newStripes }),
    });
  },

  async updatePaymentStatus(id: string, status: 'current' | 'overdue' | 'cancelled'): Promise<ApiResponse<MemberRecord>> {
    return apiRequest<ApiResponse<MemberRecord>>(`/members/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ payment_status: status }),
    });
  },

  async getMemberStats(): Promise<ApiResponse<any>> {
    return apiRequest<ApiResponse<any>>('/members/stats');
  },

  // Class Coupons Management
  async getCoupons(): Promise<ApiResponse<ClassCouponRecord[]>> {
    return apiRequest<ApiResponse<ClassCouponRecord[]>>('/coupons');
  },

  async getCoupon(id: string): Promise<ApiResponse<ClassCouponRecord>> {
    return apiRequest<ApiResponse<ClassCouponRecord>>(`/coupons/${id}`);
  },

  async getMemberCoupons(memberId: string): Promise<ApiResponse<ClassCouponRecord[]>> {
    return apiRequest<ApiResponse<ClassCouponRecord[]>>(`/members/${memberId}/coupons`);
  },

  async createCoupon(coupon: Partial<ClassCouponRecord>): Promise<ApiResponse<ClassCouponRecord>> {
    return apiRequest<ApiResponse<ClassCouponRecord>>('/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon),
    });
  },

  async updateCoupon(id: string, coupon: Partial<ClassCouponRecord>): Promise<ApiResponse<ClassCouponRecord>> {
    return apiRequest<ApiResponse<ClassCouponRecord>>(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coupon),
    });
  },

  async deleteCoupon(id: string): Promise<ApiResponse<ClassCouponRecord>> {
    return apiRequest<ApiResponse<ClassCouponRecord>>(`/coupons/${id}`, {
      method: 'DELETE',
    });
  },

  async useClass(couponId: string): Promise<ApiResponse<ClassCouponRecord>> {
    return apiRequest<ApiResponse<ClassCouponRecord>>(`/coupons/${couponId}/use`, {
      method: 'PATCH',
    });
  },

  async getCouponStats(): Promise<ApiResponse<any>> {
    return apiRequest<ApiResponse<any>>('/coupons/stats');
  },

  // Health check
  async healthCheck(): Promise<any> {
    const url = `${API_BASE_URL.replace('/api', '')}/health`;
    return fetch(url).then(res => res.json());
  },
};

// BJJ Member type matching actual database schema
export interface MemberRecord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  belt_rank: 'white' | 'blue' | 'purple' | 'brown' | 'black';
  stripes: number;
  last_promotion_date?: string;
  payment_class: 'evenings' | 'mornings' | 'both' | 'coupon';
  payment_status: 'paid' | 'overdue' | 'trial';
  active: boolean;
  created_at: string;
}

// Class Coupon type matching actual database schema
export interface ClassCouponRecord {
  id: string;
  member_id: string;
  total_classes: number;
  classes_remaining: number;
  purchase_date: string;
  expiry_date?: string;
  active: boolean;
  amount_paid?: number;
  notes?: string;
}