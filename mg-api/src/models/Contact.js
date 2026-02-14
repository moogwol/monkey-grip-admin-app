const db = require('../database');

class Member {
  static async findAll(filters = {}) {
    const statusCase = `CASE
      WHEN lp.payment_status IS NULL THEN 'overdue'
      WHEN lp.payment_status = 'overdue' THEN 'overdue'
      WHEN mp.name IS NOT NULL THEN mp.name
      ELSE lp.payment_status
    END`;
    let query = `
      WITH latest_payment AS (
        SELECT DISTINCT ON (member_id)
          member_id,
          payment_status,
          membership_plan_id,
          COALESCE(payment_date, month_date) AS effective_date
        FROM member_payments
        ORDER BY member_id, COALESCE(payment_date, month_date) DESC, created_at DESC
      )
      SELECT m.*,
        ${statusCase} AS payment_status,
        lp.payment_status AS latest_payment_status,
        lp.membership_plan_id AS latest_membership_plan_id,
        mp.name AS latest_membership_plan_name,
        lp.effective_date AS latest_payment_date
      FROM members m
      LEFT JOIN latest_payment lp ON lp.member_id = m.id
      LEFT JOIN membership_plans mp ON mp.id = lp.membership_plan_id
    `;
    let params = [];
    let conditions = [];

    // Add filters
    if (filters.active !== undefined) {
      conditions.push('m.active = $' + (params.length + 1));
      params.push(filters.active);
    }

    if (filters.belt_rank) {
      conditions.push('m.belt_rank = $' + (params.length + 1));
      params.push(filters.belt_rank);
    }

    if (filters.payment_status) {
      conditions.push(`(${statusCase}) = $` + (params.length + 1));
      params.push(filters.payment_status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY m.last_name, m.first_name';
    
    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      WITH latest_payment AS (
        SELECT DISTINCT ON (member_id)
          member_id,
          payment_status,
          membership_plan_id,
          COALESCE(payment_date, month_date) AS effective_date
        FROM member_payments
        ORDER BY member_id, COALESCE(payment_date, month_date) DESC, created_at DESC
      )
      SELECT m.*,
        CASE
          WHEN lp.payment_status IS NULL THEN 'overdue'
          WHEN lp.payment_status = 'overdue' THEN 'overdue'
          WHEN mp.name IS NOT NULL THEN mp.name
          ELSE lp.payment_status
        END AS payment_status,
        lp.payment_status AS latest_payment_status,
        lp.membership_plan_id AS latest_membership_plan_id,
        mp.name AS latest_membership_plan_name,
        lp.effective_date AS latest_payment_date
      FROM members m
      LEFT JOIN latest_payment lp ON lp.member_id = m.id
      LEFT JOIN membership_plans mp ON mp.id = lp.membership_plan_id
      WHERE m.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create(memberData) {
    const {
      first_name,
      last_name,
      avatar_url,
      email,
      phone,
      date_of_birth,
      belt_rank = 'white',
      stripes = 0,
      last_promotion_date,
      active = true
    } = memberData;

    const query = `
      INSERT INTO members (
        first_name, last_name, avatar_url, email, phone, date_of_birth,
        belt_rank, stripes, last_promotion_date, active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const values = [
      first_name, last_name, avatar_url, email, phone, date_of_birth,
      belt_rank, stripes, last_promotion_date, active
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async update(id, memberData) {
    const {
      first_name,
      last_name,
      avatar_url,
      email,
      phone,
      date_of_birth,
      belt_rank,
      stripes,
      last_promotion_date,
      active
    } = memberData;

    const query = `
      UPDATE members 
      SET first_name = $1, last_name = $2, avatar_url = $3, email = $4, phone = $5,
          date_of_birth = $6, belt_rank = $7, stripes = $8,
          last_promotion_date = $9, active = $10
      WHERE id = $11
      RETURNING *
    `;
    
    const values = [
      first_name, last_name, avatar_url, email, phone, date_of_birth,
      belt_rank, stripes, last_promotion_date, active, id
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updateProfile(id, profileData) {
    const { avatar_url, email, phone, date_of_birth, belt_rank, stripes } = profileData;
    let fields = [];
    const queryParams = [];
    
    if (avatar_url !== undefined) {
      fields.push("avatar_url = $" + (queryParams.length + 1));
      queryParams.push(avatar_url);
    }
    if (email !== undefined) {
      fields.push("email = $" + (queryParams.length + 1));
      queryParams.push(email);
    }
    if (phone !== undefined) {
      fields.push("phone = $" + (queryParams.length + 1));
      queryParams.push(phone);
    }
    if (date_of_birth !== undefined) {
      fields.push("date_of_birth = $" + (queryParams.length + 1));
      queryParams.push(date_of_birth);
    }
    if (belt_rank !== undefined) {
      fields.push("belt_rank = $" + (queryParams.length + 1));
      queryParams.push(belt_rank);
    }
    if (stripes !== undefined) {
      fields.push("stripes = $" + (queryParams.length + 1));
      queryParams.push(stripes);
    }
    
    if (fields.length === 0) {
      throw new Error("No valid fields to update");
    }
    
    const query = `UPDATE members SET ${fields.join(", ")} WHERE id = $${queryParams.length + 1} RETURNING *`;
    queryParams.push(id);
    
    const result = await db.query(query, queryParams);
    return result.rows[0];
  }

  static async delete(id) {
    // Soft delete - set active to false
    const query = 'UPDATE members SET active = false WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async hardDelete(id) {
    // Hard delete - actually remove from database
    const query = 'DELETE FROM members WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async search(searchTerm) {
    const query = `
      WITH latest_payment AS (
        SELECT DISTINCT ON (member_id)
          member_id,
          payment_status,
          membership_plan_id,
          COALESCE(payment_date, month_date) AS effective_date
        FROM member_payments
        ORDER BY member_id, COALESCE(payment_date, month_date) DESC, created_at DESC
      )
      SELECT m.*,
        CASE
          WHEN lp.payment_status IS NULL THEN 'overdue'
          WHEN lp.payment_status = 'overdue' THEN 'overdue'
          WHEN mp.name IS NOT NULL THEN mp.name
          ELSE lp.payment_status
        END AS payment_status,
        lp.payment_status AS latest_payment_status,
        lp.membership_plan_id AS latest_membership_plan_id,
        mp.name AS latest_membership_plan_name,
        lp.effective_date AS latest_payment_date
      FROM members m
      LEFT JOIN latest_payment lp ON lp.member_id = m.id
      LEFT JOIN membership_plans mp ON mp.id = lp.membership_plan_id
      WHERE (m.first_name ILIKE $1 OR m.last_name ILIKE $1 OR m.email ILIKE $1 OR m.belt_rank ILIKE $1)
        AND m.active = true
      ORDER BY m.last_name, m.first_name
    `;
    const result = await db.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  static async promoteToNextBelt(id, newBelt, newStripes = 0) {
    const query = `
      UPDATE members 
      SET belt_rank = $1, stripes = $2, last_promotion_date = CURRENT_DATE
      WHERE id = $3
      RETURNING *
    `;
    const result = await db.query(query, [newBelt, newStripes, id]);
    return result.rows[0];
  }

  static async addStripes(id, stripesToAdd = 1) {
    const query = `
      UPDATE members 
      SET stripes = LEAST(stripes + $1, 4), last_promotion_date = CURRENT_DATE
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [stripesToAdd, id]);
    return result.rows[0];
  }

  static async countActive() {
    const query = 'SELECT COUNT(*)::int AS total FROM members WHERE active = true';
    const result = await db.query(query);
    return result.rows[0]?.total || 0;
  }

  static async getBeltDistribution() {
    const query = `
      SELECT belt_rank, COUNT(*) as count
      FROM members 
      WHERE active = true
      GROUP BY belt_rank
      ORDER BY 
        CASE belt_rank
          WHEN 'white' THEN 1
          WHEN 'blue' THEN 2
          WHEN 'purple' THEN 3
          WHEN 'brown' THEN 4
          WHEN 'black' THEN 5
        END
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getPaymentStatusSummary() {
    const query = `
      WITH latest_payment AS (
        SELECT DISTINCT ON (member_id)
          member_id,
          payment_status,
          membership_plan_id
        FROM member_payments
        ORDER BY member_id, COALESCE(payment_date, month_date) DESC, created_at DESC
      )
      SELECT payment_status, COUNT(*) as count
      FROM (
        SELECT
          CASE
            WHEN lp.payment_status IS NULL THEN 'overdue'
            WHEN lp.payment_status = 'overdue' THEN 'overdue'
            WHEN mp.name IS NOT NULL THEN mp.name
            ELSE lp.payment_status
          END AS payment_status
        FROM members m
        LEFT JOIN latest_payment lp ON lp.member_id = m.id
        LEFT JOIN membership_plans mp ON mp.id = lp.membership_plan_id
        WHERE m.active = true
      ) status_rollup
      GROUP BY payment_status
    `;
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = Member;