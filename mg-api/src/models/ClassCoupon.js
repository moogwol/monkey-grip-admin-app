const db = require('../database');

class ClassCoupon {
  static async findAll(filters = {}) {
    let query = `
      SELECT cc.*, m.first_name, m.last_name, m.email 
      FROM class_coupons cc
      JOIN members m ON cc.member_id = m.id
    `;
    let params = [];
    let conditions = [];

    // Add filters
    if (filters.member_id) {
      conditions.push('cc.member_id = $' + (params.length + 1));
      params.push(filters.member_id);
    }

    if (filters.active !== undefined) {
      conditions.push('cc.active = $' + (params.length + 1));
      params.push(filters.active);
    }

    if (filters.expired !== undefined) {
      if (filters.expired) {
        conditions.push('cc.expiry_date < CURRENT_DATE');
      } else {
        conditions.push('(cc.expiry_date IS NULL OR cc.expiry_date >= CURRENT_DATE)');
      }
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY cc.purchase_date DESC, cc.id DESC';
    
    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT cc.*, m.first_name, m.last_name, m.email 
      FROM class_coupons cc
      JOIN members m ON cc.member_id = m.id
      WHERE cc.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByMemberId(memberId, activeOnly = true) {
    let query = `
      SELECT * FROM class_coupons 
      WHERE member_id = $1
    `;
    let params = [memberId];

    if (activeOnly) {
      query += ' AND active = true AND classes_remaining > 0';
      query += ' AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)';
    }

    query += ' ORDER BY expiry_date ASC NULLS LAST, purchase_date ASC';
    
    const result = await db.query(query, params);
    return result.rows;
  }

  static async create(couponData) {
    const {
      member_id,
      total_classes = 10,
      classes_remaining,
      purchase_date,
      expiry_date,
      amount_paid,
      notes,
      active = true
    } = couponData;

    // If classes_remaining not specified, use total_classes
    const remaining = classes_remaining !== undefined ? classes_remaining : total_classes;

    const values = [
      member_id, total_classes, remaining, purchase_date || new Date(),
      expiry_date, amount_paid, notes, active
    ];

    const updateQuery = `
      UPDATE class_coupons
      SET
        total_classes = class_coupons.total_classes + $2,
        classes_remaining = class_coupons.classes_remaining + $3,
        purchase_date = LEAST(class_coupons.purchase_date, $4),
        expiry_date = COALESCE($5, class_coupons.expiry_date),
        amount_paid = CASE
          WHEN class_coupons.amount_paid IS NULL AND $6::numeric IS NULL THEN NULL
          ELSE COALESCE(class_coupons.amount_paid, 0) + COALESCE($6::numeric, 0)
        END,
        notes = CASE
          WHEN NULLIF(TRIM(class_coupons.notes), '') IS NULL THEN $7::text
          WHEN NULLIF(TRIM($7::text), '') IS NULL THEN class_coupons.notes
          ELSE class_coupons.notes || ' | ' || $7::text
        END,
        active = class_coupons.active OR $8::boolean
      WHERE id = (
        SELECT id
        FROM class_coupons
        WHERE member_id = $1
        ORDER BY id DESC
        LIMIT 1
      )
      RETURNING *
    `;

    const updateResult = await db.query(updateQuery, values);
    if (updateResult.rows[0]) {
      return updateResult.rows[0];
    }

    const insertQuery = `
      INSERT INTO class_coupons (
        member_id, total_classes, classes_remaining, purchase_date,
        expiry_date, amount_paid, notes, active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    try {
      const insertResult = await db.query(insertQuery, values);
      return insertResult.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        const retryUpdateResult = await db.query(updateQuery, values);
        return retryUpdateResult.rows[0];
      }
      throw error;
    }
  }

  static async update(id, couponData) {
    const {
      total_classes,
      classes_remaining,
      expiry_date,
      amount_paid,
      notes,
      active
    } = couponData;

    const query = `
      UPDATE class_coupons 
      SET total_classes = $1, classes_remaining = $2, expiry_date = $3,
          amount_paid = $4, notes = $5, active = $6
      WHERE id = $7
      RETURNING *
    `;
    
    const values = [total_classes, classes_remaining, expiry_date, amount_paid, notes, active, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async useClass(id, classesToUse = 1) {
    // Decrement classes remaining, ensuring it doesn't go below 0
    const query = `
      UPDATE class_coupons 
      SET classes_remaining = GREATEST(classes_remaining - $1, 0),
          active = CASE 
            WHEN classes_remaining - $1 <= 0 THEN false
            ELSE active
          END
      WHERE id = $2 AND active = true AND classes_remaining > 0
        AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
      RETURNING *
    `;
    const result = await db.query(query, [classesToUse, id]);
    return result.rows[0];
  }

  static async addClasses(id, classesToAdd) {
    // Add classes to existing coupon
    const query = `
      UPDATE class_coupons 
      SET classes_remaining = classes_remaining + $1,
          total_classes = total_classes + $1,
          active = true
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [classesToAdd, id]);
    return result.rows[0];
  }

  static async deactivate(id) {
    const query = 'UPDATE class_coupons SET active = false WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM class_coupons WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getExpiringCoupons(daysFromNow = 30) {
    const query = `
      SELECT cc.*, m.first_name, m.last_name, m.email, m.phone
      FROM class_coupons cc
      JOIN members m ON cc.member_id = m.id
      WHERE cc.active = true 
        AND cc.classes_remaining > 0
        AND cc.expiry_date IS NOT NULL
        AND cc.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '$1 days'
      ORDER BY cc.expiry_date ASC
    `;
    const result = await db.query(query, [daysFromNow]);
    return result.rows;
  }

  static async getCouponStats() {
    const query = `
      SELECT 
        COUNT(*) as total_coupons,
        COUNT(*) FILTER (WHERE active = true) as active_coupons,
        COUNT(*) FILTER (WHERE classes_remaining = 0) as used_coupons,
        COUNT(*) FILTER (WHERE expiry_date < CURRENT_DATE AND active = true) as expired_coupons,
        SUM(classes_remaining) FILTER (WHERE active = true) as total_remaining_classes,
        SUM(amount_paid) as total_revenue
      FROM class_coupons
    `;
    const result = await db.query(query);
    return result.rows[0];
  }

  static async getMemberCouponSummary(memberId) {
    const query = `
      SELECT 
        COUNT(*) as total_coupons,
        COUNT(*) FILTER (WHERE active = true AND classes_remaining > 0) as active_coupons,
        SUM(classes_remaining) FILTER (WHERE active = true) as total_classes_available,
        SUM(total_classes - classes_remaining) as total_classes_used,
        SUM(amount_paid) as total_spent
      FROM class_coupons
      WHERE member_id = $1
    `;
    const result = await db.query(query, [memberId]);
    return result.rows[0];
  }
}

module.exports = ClassCoupon;