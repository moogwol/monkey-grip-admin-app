BEGIN;

-- Add the is_coupon_plan field to the table membership_plans
ALTER TABLE membership_plans
ADD COLUMN IF NOT EXISTS is_coupon_plan BOOLEAN NOT NULL DEFAULT FALSE;


-- Update all current coupon plans to reflect this change
UPDATE membership_plans
SET is_coupon_plan = TRUE
WHERE name IN ('Coupon Package', 'Bono Policial')
AND is_coupon_plan = FALSE;

COMMIT;