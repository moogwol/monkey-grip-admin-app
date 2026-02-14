const db = require('../database');

class MemberPayment {
  static async findByMemberId(memberId) {
    const query = `
      SELECT mp.*, p.name AS plan_name, p.price AS plan_price
      FROM member_payments mp
      LEFT JOIN membership_plans p ON p.id = mp.membership_plan_id
      WHERE mp.member_id = $1
      ORDER BY COALESCE(mp.payment_date, mp.month_date) DESC, mp.created_at DESC
    `;
    const result = await db.query(query, [memberId]);
    return result.rows;
  }

  static async create(memberId, paymentData) {
    const {
      membership_plan_id,
      amount_paid,
      payment_date,
      payment_status = 'paid',
      month_date,
      notes
    } = paymentData;

    const query = `
      INSERT INTO member_payments (
        member_id,
        month_date,
        payment_status,
        membership_plan_id,
        amount_paid,
        payment_date,
        notes
      )
      VALUES (
        $1,
        COALESCE($2, date_trunc('month', COALESCE($3, CURRENT_DATE))::date),
        $4,
        $5,
        $6,
        $3,
        $7
      )
      ON CONFLICT (member_id, month_date)
      DO UPDATE SET
        payment_status = EXCLUDED.payment_status,
        membership_plan_id = EXCLUDED.membership_plan_id,
        amount_paid = EXCLUDED.amount_paid,
        payment_date = EXCLUDED.payment_date,
        notes = EXCLUDED.notes
      RETURNING *
    `;

    const values = [
      memberId,
      month_date || null,
      payment_date || null,
      payment_status,
      membership_plan_id,
      amount_paid ?? null,
      notes || null
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async getCurrentMonthTotal() {
    const query = `
      SELECT COALESCE(SUM(amount_paid), 0) AS total
      FROM member_payments
      WHERE payment_status = 'paid'
        AND date_trunc('month', COALESCE(payment_date, month_date)) = date_trunc('month', CURRENT_DATE)
    `;
    const result = await db.query(query);
    return result.rows[0]?.total || 0;
  }
}

module.exports = MemberPayment;
