const db = require('../database');

class Contact {
  static async findAll() {
    const query = 'SELECT * FROM contacts ORDER BY last_name, first_name';
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM contacts WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create(contactData) {
    const { first_name, last_name, email, twitter, avatar, notes, favorite } = contactData;
    const query = `
      INSERT INTO contacts (first_name, last_name, email, twitter, avatar, notes, favorite)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [first_name, last_name, email, twitter, avatar, notes, favorite || false];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async update(id, contactData) {
    const { first_name, last_name, email, twitter, avatar, notes, favorite } = contactData;
    const query = `
      UPDATE contacts 
      SET first_name = $1, last_name = $2, email = $3, twitter = $4, 
          avatar = $5, notes = $6, favorite = $7
      WHERE id = $8
      RETURNING *
    `;
    const values = [first_name, last_name, email, twitter, avatar, notes, favorite, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM contacts WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async search(searchTerm) {
    const query = `
      SELECT * FROM contacts 
      WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1
      ORDER BY last_name, first_name
    `;
    const result = await db.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  static async toggleFavorite(id) {
    const query = `
      UPDATE contacts 
      SET favorite = NOT favorite 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Contact;