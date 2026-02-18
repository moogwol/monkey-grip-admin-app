-- Enforce one class coupon row per member while preserving data.
-- Strategy:
-- 1) Snapshot current rows into a backup table (first run only)
-- 2) Merge duplicate coupon rows per member into a canonical row
-- 3) Delete duplicate rows
-- 4) Add uniqueness enforcement on member_id

BEGIN;

CREATE TABLE IF NOT EXISTS class_coupons_backup_single_coupon_migration (
    LIKE class_coupons INCLUDING ALL
);

INSERT INTO class_coupons_backup_single_coupon_migration
SELECT *
FROM class_coupons
WHERE NOT EXISTS (
    SELECT 1
    FROM class_coupons_backup_single_coupon_migration
    LIMIT 1
);

WITH ranked AS (
    SELECT
        c.*,
        ROW_NUMBER() OVER (PARTITION BY c.member_id ORDER BY c.id DESC) AS rn
    FROM class_coupons c
),
aggregated AS (
    SELECT
        r.member_id,
        MAX(r.id) FILTER (WHERE r.rn = 1) AS keep_id,
        SUM(r.total_classes) AS merged_total_classes,
        SUM(r.classes_remaining) AS merged_classes_remaining,
        MIN(r.purchase_date) AS merged_purchase_date,
        MAX(r.expiry_date) AS merged_expiry_date,
        CASE
            WHEN COUNT(r.amount_paid) = 0 THEN NULL
            ELSE SUM(COALESCE(r.amount_paid, 0))
        END AS merged_amount_paid,
        BOOL_OR(r.active) AS merged_active,
        NULLIF(
            STRING_AGG(NULLIF(TRIM(r.notes), ''), ' | ' ORDER BY r.id),
            ''
        ) AS merged_notes
    FROM ranked r
    GROUP BY r.member_id
),
updated AS (
    UPDATE class_coupons c
    SET
        total_classes = a.merged_total_classes,
        classes_remaining = a.merged_classes_remaining,
        purchase_date = a.merged_purchase_date,
        expiry_date = a.merged_expiry_date,
        amount_paid = a.merged_amount_paid,
        active = a.merged_active,
        notes = a.merged_notes
    FROM aggregated a
    WHERE c.id = a.keep_id
    RETURNING c.id
)
DELETE FROM class_coupons c
USING aggregated a
WHERE c.member_id = a.member_id
  AND c.id <> a.keep_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_coupons_member_unique
ON class_coupons (member_id);

COMMIT;
