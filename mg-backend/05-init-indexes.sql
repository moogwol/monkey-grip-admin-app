CREATE INDEX IF NOT EXISTS idx_members_active ON members (active);
CREATE INDEX IF NOT EXISTS idx_members_belt_rank ON members (belt_rank, stripes);
CREATE INDEX IF NOT EXISTS idx_members_payment_status ON members (payment_status);
CREATE INDEX IF NOT EXISTS idx_members_payment_class ON members (payment_class);

CREATE INDEX IF NOT EXISTS idx_coupons_member_active ON class_coupons (member_id, active);
CREATE INDEX IF NOT EXISTS idx_coupons_expiry ON class_coupons (expiry_date)
WHERE expiry_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_membership_plans_active ON membership_plans (active);

CREATE INDEX IF NOT EXISTS idx_member_payments_member_month ON member_payments (member_id, month_date);
