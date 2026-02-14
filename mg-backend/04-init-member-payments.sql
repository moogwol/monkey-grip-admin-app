gitCREATE TABLE IF NOT EXISTS member_payments (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members (id) ON DELETE CASCADE,
    month_date DATE NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'overdue',
    membership_plan_id INTEGER REFERENCES membership_plans (id) ON DELETE SET NULL,
    amount_paid DECIMAL(10, 2) CHECK (amount_paid >= 0),
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE member_payments ADD CONSTRAINT member_payments_member_month_unique
UNIQUE (member_id, month_date);
