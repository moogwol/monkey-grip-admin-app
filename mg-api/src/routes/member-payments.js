const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const MemberPayment = require('../models/MemberPayment');

const router = express.Router();

const validateMemberPayment = [
  body('membership_plan_id')
    .notEmpty()
    .withMessage('Membership plan is required')
    .isInt({ min: 1 })
    .withMessage('Membership plan must be a valid ID'),
  body('payment_date')
    .optional()
    .isISO8601()
    .withMessage('Payment date must be a valid date'),
  body('amount_paid')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount paid must be a non-negative number'),
  body('payment_status')
    .optional()
    .isIn(['paid', 'overdue'])
    .withMessage('Payment status must be paid or overdue'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be under 500 characters')
];

// GET /members/:id/payments - List payments for a member
router.get('/:id/payments', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }

    const payments = await MemberPayment.findByMemberId(id);

    res.json({
      success: true,
      data: payments,
      count: payments.length
    });
  } catch (error) {
    console.error('Error fetching member payments:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /members/:id/payments - Record a payment for a member
router.post('/:id/payments', validateMemberPayment, async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { membership_plan_id, amount_paid, payment_date, payment_status, notes } = req.body;

    const planResult = await db.query(
      'SELECT id, price FROM membership_plans WHERE active = true AND id = $1',
      [membership_plan_id]
    );

    if (planResult.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Membership plan must be an active plan'
      });
    }

    const plan = planResult.rows[0];
    const resolvedAmount = amount_paid !== undefined ? amount_paid : plan.price;

    const payment = await MemberPayment.create(id, {
      membership_plan_id: plan.id,
      amount_paid: resolvedAmount,
      payment_date: payment_date || new Date().toISOString().slice(0, 10),
      payment_status: payment_status || 'paid',
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: payment
    });
  } catch (error) {
    console.error('Error recording member payment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// check each member payment status. If the status has is_coupon_plan = true,
//  the payment status should be set to bono anterior
router.put('/update-coupon-status', async (req, res) => {
  const query = `
  UPDATE member_payments
  SET payment_status = 'Bono anterior'
  WHERE membership_plan_id IN (
    SELECT id FROM membership_plans WHERE is_coupon_plan = true
  )
  AND payment_status != 'Bono anterior'
  RETURNING *
`;
  try {
    const result = await db.query(query);

    res.json({
      success: true,
      message: 'Coupon payment statuses updated successfully',
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error updating coupon payment statuses:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});



module.exports = router;
