CREATE TABLE IF NOT EXISTS class_coupons (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members (id) ON DELETE CASCADE,
    total_classes INTEGER DEFAULT 10 CHECK (total_classes > 0),
    classes_remaining INTEGER DEFAULT 10 CHECK (classes_remaining >= 0),
    purchase_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    active BOOLEAN DEFAULT TRUE,
    amount_paid DECIMAL(10, 2) CHECK (amount_paid >= 0),
    notes TEXT
);

-- Constraint to ensure expiry_date is in the future when set
ALTER TABLE class_coupons ADD CONSTRAINT check_expiry_future CHECK (
    expiry_date IS NULL
    OR expiry_date > purchase_date
);

-- Constraint to ensure classes_remaining doesn't exceed total_classes
ALTER TABLE class_coupons ADD CONSTRAINT check_remaining_valid CHECK (
    classes_remaining <= total_classes
);
CREATE TABLE IF NOT EXISTS class_coupons (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members (id) ON DELETE CASCADE,
    total_classes INTEGER DEFAULT 10 CHECK (total_classes > 0),
    classes_remaining INTEGER DEFAULT 10 CHECK (classes_remaining >= 0),
    purchase_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    active BOOLEAN DEFAULT TRUE,
    amount_paid DECIMAL(10, 2) CHECK (amount_paid >= 0),
    notes TEXT
);
