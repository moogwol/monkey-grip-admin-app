const db = require('../database');

class Member {
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM members';
    let params = [];
    let conditions = [];

    // Add filters
    if (filters.active !== undefined) {
      conditions.push('active = $' + (params.length + 1));
      params.push(filters.active);
    }

    if (filters.belt_rank) {
      conditions.push('belt_rank = $' + (params.length + 1));
      params.push(filters.belt_rank);
    }

    if (filters.payment_status) {
      conditions.push('payment_status = $' + (params.length + 1));
      params.push(filters.payment_status);
    }

    if (filters.payment_class) {
      conditions.push('payment_class = $' + (params.length + 1));
      params.push(filters.payment_class);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY last_name, first_name';
    
    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM members WHERE id = $1';
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
      payment_class = 'evenings',
      payment_status = 'trial',
      active = true
    } = memberData;

    const query = `
      INSERT INTO members (
        first_name, last_name, avatar_url, email, phone, date_of_birth,
        belt_rank, stripes, last_promotion_date, payment_class, payment_status, active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    
    const values = [
      first_name, last_name, avatar_url, email, phone, date_of_birth,
      belt_rank, stripes, last_promotion_date, payment_class, payment_status, active
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
      payment_class,
      payment_status,
      active
    } = memberData;

    const query = `
      UPDATE members 
      SET first_name = $1, last_name = $2, avatar_url = $3, email = $4, phone = $5,
          date_of_birth = $6, belt_rank = $7, stripes = $8,
          last_promotion_date = $9, payment_class = $10, payment_status = $11, active = $12
      WHERE id = $13
      RETURNING *
    `;
    
    const values = [
      first_name, last_name, avatar_url, email, phone, date_of_birth,
      belt_rank, stripes, last_promotion_date, payment_class, payment_status, active, id
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updateProfile(id, profileData) {
    const { avatar_url, email, phone, date_of_birth, belt_rank, stripes, payment_class, payment_status } = profileData;
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
    if (payment_class !== undefined) {
      fields.push("payment_class = $" + (queryParams.length + 1));
      queryParams.push(payment_class);
    }
    if (payment_status !== undefined) {
      fields.push("payment_status = $" + (queryParams.length + 1));
      queryParams.push(payment_status);
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
      SELECT * FROM members 
      WHERE (first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 OR belt_rank ILIKE $1)
        AND active = true
      ORDER BY last_name, first_name
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

  static async updatePaymentStatus(id, status) {
    const query = `
      UPDATE members 
      SET payment_status = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [status, id]);
    return result.rows[0];
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
      SELECT payment_status, COUNT(*) as count
      FROM members 
      WHERE active = true
      GROUP BY payment_status
    `;
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = Member;