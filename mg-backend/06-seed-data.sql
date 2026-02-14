-- Add sample BJJ club members and class coupons to the database

-- Sample members with various belt ranks
INSERT INTO members (first_name, last_name, email, phone, date_of_birth, belt_rank, stripes, last_promotion_date, active, avatar_url) VALUES 
-- Active paying members
('João', 'Silva', 'joao.silva@email.com', '+1-555-0101', '1990-05-15', 'blue', 2, '2024-06-01', true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
('Maria', 'Santos', 'maria.santos@email.com', '+1-555-0102', '1995-03-20', 'blue', 4, '2024-08-15', true, 'https://i.pinimg.com/originals/9a/4b/aa/9a4baae65a700634f6c2d2e0e52aa650.jpg'),
('Carlos', 'Oliveira', 'carlos.oliveira@email.com', '+1-555-0103', '1988-12-10', 'purple', 1, '2024-01-20', true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),

-- Trial and overdue members
('Ana', 'Costa', 'ana.costa@email.com', '+1-555-0104', '1992-07-08', 'white', 0, NULL, true, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'),
('Roberto', 'Ferreira', 'roberto.ferreira@email.com', '+1-555-0105', '1985-11-22', 'blue', 3, '2023-12-15', true, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'),

-- Coupon-based members
('Isabella', 'Machado', 'isabella.machado@email.com', '+1-555-0106', '1993-09-03', 'white', 2, '2024-07-10', true, ''),
('Pedro', 'Almeida', 'pedro.almeida@email.com', '+1-555-0107', '1991-04-18', 'white', 1, '2024-05-20', true, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'),

-- Advanced belts
('Professor', 'Anderson', 'prof.anderson@email.com', '+1-555-0108', '1980-01-12', 'black', 3, '2020-08-01', true, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'),
('Instructor', 'Martinez', 'coach.martinez@email.com', '+1-555-0109', '1987-06-25', 'brown', 2, '2023-03-15', true, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'),

-- Inactive member (former student)
('Lucas', 'Barbosa', 'lucas.barbosa@email.com', '+1-555-0110', '1994-02-14', 'blue', 0, '2023-10-30', false, 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face');

-- Set up initial membership plans
INSERT INTO membership_plans (name, price, description, active) VALUES
('Evenings Only', 45.00, 'Access to all evening classes (6pm-7:30pm)', true),
('Mornings Only', 45.00, 'Access to all morning classes (10am-11:30am)', true),
('Full Access', 55.00, 'Unlimited access to all classes', true),
('Coupon Package', 70.00, '10-class package for coupon-based members', true);

-- Sample class coupons for coupon-based members and some regular members who bought packages
INSERT INTO class_coupons (member_id, total_classes, classes_remaining, purchase_date, expiry_date, amount_paid, active, notes) VALUES 
-- Ana's trial coupon (almost used up)
(4, 10, 2, '2024-09-01', '2025-01-31', 120.00, true, 'Trial package - first time student'),

-- Isabella's active coupon
(6, 10, 7, '2024-08-15', '2025-02-15', 150.00, true, 'Standard 10-class package'),

-- Pedro's coupon (nearly finished)
(7, 10, 1, '2024-07-20', '2025-01-20', 150.00, true, 'Standard 10-class package'),

-- João bought an extra coupon package
(1, 10, 10, '2024-09-20', '2025-03-20', 140.00, true, 'Member discount applied'),

-- Roberto's expired unused coupon (inactive member who went overdue)
(5, 10, 8, '2024-02-01', '2024-08-01', 150.00, false, 'Expired - member went overdue'),

-- Professor Anderson's unlimited training coupon (instructor perk)
(8, 50, 50, '2024-01-01', '2024-12-31', 0.00, true, 'Instructor training package - complimentary');

-- Seed current month payment records
INSERT INTO member_payments (member_id, month_date, payment_status, membership_plan_id, amount_paid, payment_date, notes) VALUES
(1, date_trunc('month', CURRENT_DATE)::date, 'paid', (SELECT id FROM membership_plans WHERE name = 'Full Access'), 55.00, CURRENT_DATE, 'Seeded payment'),
(2, date_trunc('month', CURRENT_DATE)::date, 'paid', (SELECT id FROM membership_plans WHERE name = 'Full Access'), 55.00, CURRENT_DATE, 'Seeded payment'),
(3, date_trunc('month', CURRENT_DATE)::date, 'paid', (SELECT id FROM membership_plans WHERE name = 'Mornings Only'), 45.00, CURRENT_DATE, 'Seeded payment'),
(4, date_trunc('month', CURRENT_DATE)::date, 'overdue', (SELECT id FROM membership_plans WHERE name = 'Evenings Only'), NULL, NULL, 'Seeded payment'),
(5, date_trunc('month', CURRENT_DATE)::date, 'overdue', (SELECT id FROM membership_plans WHERE name = 'Full Access'), NULL, NULL, 'Seeded payment');

-- Sample data showing different scenarios:
-- Member 4 (Ana): Trial member with almost used coupon
-- Member 6 (Isabella): Active coupon user
-- Member 7 (Pedro): About to finish coupon
-- Member 1 (João): Regular member who also bought a coupon
-- Member 5 (Roberto): Overdue member with expired coupon
-- Member 8 (Professor): Instructor with special package