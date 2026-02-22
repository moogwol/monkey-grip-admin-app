////////////////////////////////////////////////////////////////////////////////
// API-based data layer for BJJ Club Management System
// Data layer for member and coupon management
////////////////////////////////////////////////////////////////////////////////

import { apiClient, type MemberRecord, type ClassCouponRecord, type MembershipPlanRecord } from "./api";

// Member mutation type for frontend forms
export type MemberMutation = {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  belt_rank?: 'white' | 'blue' | 'purple' | 'brown' | 'black';
  stripes?: number;
  last_promotion_date?: string;
  active?: boolean;
};

// Coupon mutation type for frontend forms
export type CouponMutation = {
  id?: string;
  member_id?: string;
  total_classes?: number;
  classes_remaining?: number;
  purchase_date?: string;
  expiry_date?: string;
  active?: boolean;
  amount_paid?: number;
  notes?: string;
};

// Export types for compatibility
export type { MemberRecord, ClassCouponRecord, MembershipPlanRecord };

////////////////////////////////////////////////////////////////////////////////
// Member API wrapper functions
export async function getMembers(query?: string | null, cookie?: string) {
//   export async function getMembers(q: string | null, options?: RequestInit) {


  try {
    const response = await apiClient.getMembers(query || undefined);
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return [];
  }
}

export async function createEmptyMember() {
  try {
    // Generate a unique placeholder email to avoid conflicts
    const timestamp = Date.now();
    const response = await apiClient.createMember({
      first_name: 'New',
      last_name: 'Member',
      email: `member${timestamp}@example.com`,
      belt_rank: 'white',
      stripes: 0,
      active: true,
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create member');
  } catch (error) {
    console.error('Failed to create member:', error);
    throw error;
  }
}

export async function createMember(member: MemberMutation) {
  try {
    const response = await apiClient.createMember(member);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create member');
  } catch (error) {
    console.error('Failed to create member:', error);
    throw error;
  }
}

export async function getMember(id: string) {
  try {
    const response = await apiClient.getMember(id);
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch member:', error);
    return null;
  }
}

export async function updateMember(id: string, updates: MemberMutation) {
  try {
    const response = await apiClient.updateMember(id, updates);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update member');
  } catch (error) {
    console.error('Failed to update member:', error);
    throw error;
  }
}

export async function deleteMember(id: string) {
  try {
    const response = await apiClient.deleteMember(id);
    if (response.success) {
      return;
    }
    throw new Error(response.message || 'Failed to delete member');
  } catch (error) {
    console.error('Failed to delete member:', error);
    throw error;
  }
}

export async function promoteMember(id: string, newBelt: string, newStripes: number) {
  try {
    const response = await apiClient.promoteMember(id, newBelt, newStripes);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to promote member');
  } catch (error) {
    console.error('Failed to promote member:', error);
    throw error;
  }
}

export async function createMemberPayment(
  id: string,
  payment: { membership_plan_id: number; payment_date?: string; amount_paid?: number; notes?: string }
) {
  try {
    const response = await apiClient.createMemberPayment(id, payment);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to record payment');
  } catch (error) {
    console.error('Failed to record payment:', error);
    throw error;
  }
}

export async function getPaymentPlans(activeOnly = true) {
  try {
    const response = await apiClient.getPaymentPlans(activeOnly);
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch payment plans:', error);
    return [];
  }
}

export async function getPaymentPlan(id: string) {
  try {
    const response = await apiClient.getPaymentPlan(id);
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch payment plan:', error);
    return null;
  }
}

export async function getMemberPayments(memberId: string) {
  try {
    const response = await apiClient.getMemberPayments(memberId);
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch member payments:', error);
    return [];
  }
}

export async function getMemberStats() {
  try {
    const response = await apiClient.getMemberStats();
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch member stats:', error);
    return null;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Coupon API wrapper functions
export async function getCoupons() {
  try {
    const response = await apiClient.getCoupons();
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch coupons:', error);
    return [];
  }
}

export async function getMemberCoupons(memberId: string) {
  try {
    const response = await apiClient.getMemberCoupons(memberId);
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch member coupons:', error);
    return [];
  }
}

export async function getCoupon(id: string) {
  try {
    const response = await apiClient.getCoupon(id);
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch coupon:', error);
    return null;
  }
}

export async function createCoupon(coupon: CouponMutation) {
  try {
    const response = await apiClient.createCoupon(coupon);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create coupon');
  } catch (error) {
    console.error('Failed to create coupon:', error);
    throw error;
  }
}

export async function updateCoupon(id: string, updates: CouponMutation) {
  try {
    const response = await apiClient.updateCoupon(id, updates);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update coupon');
  } catch (error) {
    console.error('Failed to update coupon:', error);
    throw error;
  }
}

export async function deleteCoupon(id: string) {
  try {
    const response = await apiClient.deleteCoupon(id);
    if (response.success) {
      return;
    }
    throw new Error(response.message || 'Failed to delete coupon');
  } catch (error) {
    console.error('Failed to delete coupon:', error);
    throw error;
  }
}

export async function useClass(couponId: string, classes = 1) {
  try {
    const response = await apiClient.useClass(couponId, classes);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to use class');
  } catch (error) {
    console.error('Failed to use class:', error);
    throw error;
  }
}

export async function addClasses(couponId: string, classes = 1) {
  try {
    const response = await apiClient.addCouponClasses(couponId, classes);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to add classes');
  } catch (error) {
    console.error('Failed to add classes:', error);
    throw error;
  }
}

export async function getCouponStats() {
  try {
    const response = await apiClient.getCouponStats();
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch coupon stats:', error);
    return null;
  }
}
