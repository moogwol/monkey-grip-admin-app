const db = require('../database');

class Auth {
  // Find user by username
  static async findByUsername(username) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE username = $1 AND active = TRUE',
        [username]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const result = await db.query(
        'SELECT id, username, email, full_name, is_admin, created_at FROM users WHERE id = $1 AND active = TRUE',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create a new user (for initial setup only)
  static async createUser(username, passwordHash, email, fullName) {
    try {
      const result = await db.query(
        `INSERT INTO users (username, password_hash, email, full_name, is_admin, active)
         VALUES ($1, $2, $3, $4, TRUE, TRUE)
         RETURNING id, username, email, full_name, is_admin`,
        [username, passwordHash, email, fullName]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async updateUser(id, updates) {
    const allowedFields = ['email', 'full_name'];
    const fields = [];
    const values = [id];
    let paramCount = 2;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) return null;

    fields.push('updated_at = CURRENT_TIMESTAMP');

    const result = await db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $1 RETURNING id, username, email, full_name, is_admin`,
      values
    );
    return result.rows[0] || null;
  }

  // Get all users (admin only)
  static async getAllUsers() {
    try {
      const result = await db.query(
        'SELECT id, username, email, full_name, is_admin, active, created_at FROM users ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Auth;
