-- Add sample BJJ club members and class coupons to the database

-- Sample members with various belt ranks, payment classes, and statuses
INSERT INTO members (first_name, last_name, email, phone, date_of_birth, belt_rank, stripes, last_promotion_date, payment_class, payment_status, active) VALUES 
-- Active paying members with different payment classes
('João', 'Silva', 'joao.silva@email.com', '+1-555-0101', '1990-05-15', 'blue', 2, '2024-06-01', 'evenings', 'paid', true),
('Maria', 'Santos', 'maria.santos@email.com', '+1-555-0102', '1995-03-20', 'white', 4, '2024-08-15', 'both', 'paid', true),
('Carlos', 'Oliveira', 'carlos.oliveira@email.com', '+1-555-0103', '1988-12-10', 'purple', 1, '2024-01-20', 'mornings', 'paid', true),

-- Trial and overdue members
('Ana', 'Costa', 'ana.costa@email.com', '+1-555-0104', '1992-07-08', 'white', 0, NULL, 'evenings', 'trial', true),
('Roberto', 'Ferreira', 'roberto.ferreira@email.com', '+1-555-0105', '1985-11-22', 'blue', 3, '2023-12-15', 'both', 'overdue', true),

-- Coupon-based members
('Isabella', 'Machado', 'isabella.machado@email.com', '+1-555-0106', '1993-09-03', 'white', 2, '2024-07-10', 'coupon', 'paid', true),
('Pedro', 'Almeida', 'pedro.almeida@email.com', '+1-555-0107', '1991-04-18', 'white', 1, '2024-05-20', 'coupon', 'paid', true),

-- Advanced belts
('Professor', 'Anderson', 'prof.anderson@email.com', '+1-555-0108', '1980-01-12', 'black', 3, '2020-08-01', 'both', 'paid', true),
('Instructor', 'Martinez', 'coach.martinez@email.com', '+1-555-0109', '1987-06-25', 'brown', 2, '2023-03-15', 'both', 'paid', true),

-- Inactive member (former student)
('Lucas', 'Barbosa', 'lucas.barbosa@email.com', '+1-555-0110', '1994-02-14', 'blue', 0, '2023-10-30', 'evenings', 'paid', false);

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

-- Sample data showing different scenarios:
-- Member 4 (Ana): Trial member with almost used coupon
-- Member 6 (Isabella): Active coupon user
-- Member 7 (Pedro): About to finish coupon
-- Member 1 (João): Regular member who also bought a coupon
-- Member 5 (Roberto): Overdue member with expired coupon
-- Member 8 (Professor): Instructor with special package