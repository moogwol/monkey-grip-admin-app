-- SQL script to create tables for BJJ club management system
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    date_of_birth DATE,
    belt_rank VARCHAR(20) DEFAULT 'white' CHECK (belt_rank IN ('white', 'blue', 'purple', 'brown', 'black')),
    stripes INTEGER DEFAULT 0 CHECK (stripes >= 0 AND stripes <= 4),
    last_promotion_date DATE,
    payment_class VARCHAR(20) DEFAULT 'evenings' CHECK (payment_class IN ('evenings', 'mornings', 'both', 'coupon')),
    payment_status VARCHAR(20) DEFAULT 'trial' CHECK (payment_status IN ('paid', 'overdue', 'trial')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_coupons (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    total_classes INTEGER DEFAULT 10 CHECK (total_classes > 0),
    classes_remaining INTEGER DEFAULT 10 CHECK (classes_remaining >= 0),
    purchase_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    active BOOLEAN DEFAULT TRUE,
    amount_paid DECIMAL(10,2) CHECK (amount_paid >= 0),
    notes TEXT
);

-- Indexes for performance optimization
CREATE INDEX idx_members_active ON members(active);
CREATE INDEX idx_members_belt_rank ON members(belt_rank, stripes);
CREATE INDEX idx_members_payment_status ON members(payment_status);
CREATE INDEX idx_members_payment_class ON members(payment_class);
CREATE INDEX idx_coupons_member_active ON class_coupons(member_id, active);
CREATE INDEX idx_coupons_expiry ON class_coupons(expiry_date) WHERE expiry_date IS NOT NULL;

-- Constraint to ensure expiry_date is in the future when set
ALTER TABLE class_coupons ADD CONSTRAINT check_expiry_future 
CHECK (expiry_date IS NULL OR expiry_date > purchase_date);

-- Constraint to ensure classes_remaining doesn't exceed total_classes
ALTER TABLE class_coupons ADD CONSTRAINT check_remaining_valid 
CHECK (classes_remaining <= total_classes);
