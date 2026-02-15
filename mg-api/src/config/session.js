const db = require('../database');

// Simple session store using PostgreSQL
class PgSessionStore {
  async get(sid, callback) {
    try {
      const result = await db.query('SELECT data FROM sessions WHERE id = $1 AND expires_at > NOW()', [sid]);
      if (result.rows.length === 0) {
        return callback(null, null);
      }
      try {
        const data = JSON.parse(result.rows[0].data);
        return callback(null, data);
      } catch (err) {
        return callback(err);
      }
    } catch (err) {
      return callback(err);
    }
  }

  async set(sid, sess, callback) {
    try {
      const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      const data = JSON.stringify(sess);
      
      await db.query(
        `INSERT INTO sessions (id, user_id, data, expires_at) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE 
         SET data = $3, expires_at = $4, created_at = CURRENT_TIMESTAMP`,
        [sid, sess.userId, data, expires_at]
      );
      return callback(null);
    } catch (err) {
      return callback(err);
    }
  }

  async destroy(sid, callback) {
    try {
      await db.query('DELETE FROM sessions WHERE id = $1', [sid]);
      return callback(null);
    } catch (err) {
      return callback(err);
    }
  }

  async clear(callback) {
    try {
      await db.query('DELETE FROM sessions WHERE expires_at <= NOW()');
      return callback(null);
    } catch (err) {
      return callback(err);
    }
  }
}

module.exports = PgSessionStore;
