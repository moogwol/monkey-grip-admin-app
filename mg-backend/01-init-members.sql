CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    date_of_birth DATE,
    belt_rank VARCHAR(20) DEFAULT 'white' CHECK (
        belt_rank IN ('white', 'blue', 'purple', 'brown', 'black')
    ),
    stripes INTEGER DEFAULT 0 CHECK (
        stripes >= 0
        AND stripes <= 4
    ),
    last_promotion_date DATE,
    payment_class VARCHAR(20) DEFAULT 'evenings' CHECK (
        payment_class IN ('evenings', 'mornings', 'both', 'coupon')
    ),
    payment_status VARCHAR(20) DEFAULT 'overdue',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
