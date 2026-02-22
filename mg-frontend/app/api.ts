// API client for BJJ Club Management System
const resolveApiBaseUrl = () => {
  const envApiUrl = (import.meta as any).env?.VITE_API_URL as string | undefined;
  const isDev = Boolean((import.meta as any).env?.DEV);

  // Server-side/SSR inside Docker can resolve service names like `mg-api`.
  if (typeof window === 'undefined') {
    return envApiUrl || (isDev ? '/api' : 'http://mg-api:3000/api');
  }

  if (!envApiUrl) {
    return isDev ? '/api' : `${window.location.protocol}//${window.location.hostname}:3000/api`;
  }

  if (envApiUrl.startsWith('/')) {
    return envApiUrl;
  }

  try {
    const parsed = new URL(envApiUrl);

    // Browser cannot resolve Docker internal hostnames.
    if (parsed.hostname === 'mg-api') {
      return `${window.location.protocol}//${window.location.hostname}:3000${parsed.pathname}`;
    }

    return envApiUrl;
  } catch {
    return envApiUrl;
  }
};

const API_BASE_URL = resolveApiBaseUrl();


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

// async function apiRequest<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const url = `${API_BASE_URL}${endpoint}`;

//   const config: RequestInit = {
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//     credentials: 'include', // Include cookies for session-based auth
//     ...options,
//   };

//   try {
//     const response = await fetch(url, config);

//     if (!response.ok) {
//       let errorData;
//       try {
//         errorData = await response.json();
//       } catch {
//         errorData = { message: response.statusText };
//       }
//       throw new ApiError(response.status, errorData.message || response.statusText, errorData);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     if (error instanceof ApiError) {
//       throw error;
//     }
//     // Network or other errors
//     throw new ApiError(0, 'Network error or server unavailable', error);
//   }
// }

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // const config: RequestInit = {
  //   credentials: 'include',
  //   ...options,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     ...(options.headers || {})
  //   }
  // };

  const config: RequestInit = {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.headers || {}), 'Content-Type': 'application/json',
    }
  };

  const response = await fetch(url, config);
  return response.json();
}


export const apiClient = {
  // Authentication
  async login(username: string, password: string): Promise<ApiResponse<any>> {
    return apiRequest<ApiResponse<any>>('/auth/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });
  },

  async logout(): Promise<ApiResponse<any>> {
    return apiRequest<ApiResponse<any>>('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  },

  async getCurrentUser(options: RequestInit = {}): Promise<ApiResponse<any>> {
    return apiRequest<ApiResponse<any>>('/auth/me', {
      credentials: 'include',
      ...options
    });
  },


  async register(username: string, password: string, email: string, fullName: string): Promise<ApiResponse<any>> {
    return apiRequest<ApiResponse<any>>('/auth/register', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ username, password, email, full_name: fullName }),
    });
  },

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

  async getPaymentPlans(activeOnly = true): Promise<ApiResponse<MembershipPlanRecord[]>> {
    const query = activeOnly ? '?active=true' : '';
    return apiRequest<ApiResponse<MembershipPlanRecord[]>>(`/payment-plans${query}`);
  },

  async getPaymentPlan(id: string): Promise<ApiResponse<MembershipPlanRecord>> {
    return apiRequest<ApiResponse<MembershipPlanRecord>>(`/payment-plans/${id}`);
  },

  async getMemberPayments(memberId: string): Promise<ApiResponse<MemberPaymentRecord[]>> {
    return apiRequest<ApiResponse<MemberPaymentRecord[]>>(`/members/${memberId}/payments`);
  },

  async createMemberPayment(
    memberId: string,
    payment: Partial<MemberPaymentRecord>
  ): Promise<ApiResponse<MemberPaymentRecord>> {
    return apiRequest<ApiResponse<MemberPaymentRecord>>(`/members/${memberId}/payments`, {
      method: 'POST',
      body: JSON.stringify(payment),
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

  async useClass(couponId: string, classes = 1): Promise<ApiResponse<ClassCouponRecord>> {
    return apiRequest<ApiResponse<ClassCouponRecord>>(`/coupons/${couponId}/use`, {
      method: 'PATCH',
      body: JSON.stringify({ classes }),
    });
  },

  async addCouponClasses(couponId: string, classes = 1): Promise<ApiResponse<ClassCouponRecord>> {
    return apiRequest<ApiResponse<ClassCouponRecord>>(`/coupons/${couponId}/add-classes`, {
      method: 'PATCH',
      body: JSON.stringify({ classes }),
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
  payment_status: string;
  latest_payment_status?: string | null;
  latest_membership_plan_id?: number | null;
  latest_membership_plan_name?: string | null;
  latest_payment_date?: string | null;
  active: boolean;
  created_at: string;
}

export interface MembershipPlanRecord {
  id: string;
  name: string;
  price: string | number | null;
  description?: string | null;
  active: boolean;
  is_coupon_plan?: boolean;
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

export interface MemberPaymentRecord {
  id: string;
  member_id: string;
  month_date: string;
  payment_status: string;
  membership_plan_id: number | null;
  plan_name?: string | null;
  plan_price?: number | string | null;
  amount_paid?: number | string | null;
  payment_date?: string | null;
  notes?: string | null;
  created_at?: string | null;
}