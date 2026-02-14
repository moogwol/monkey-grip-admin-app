const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const Member = require('../models/Contact'); // Will be renamed to Member model
const MemberPayment = require('../models/MemberPayment');

const router = express.Router();

const validateMember = [
  body('first_name')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 100 })
    .withMessage('First name must be less than 100 characters'),
  body('last_name')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 100 })
    .withMessage('Last name must be less than 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters'),
  body('phone')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Phone must be less than 20 characters'),
  body('date_of_birth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  body('belt_rank')
    .optional()
    .isIn(['white', 'blue', 'purple', 'brown', 'black'])
    .withMessage('Belt rank must be: white, blue, purple, brown, or black'),
  body('stripes')
    .optional()
    .isInt({ min: 0, max: 4 })
    .withMessage('Stripes must be between 0 and 4'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// GET /members - Get all members with optional filtering
router.get('/', async (req, res) => {
  try {
    const { search, active, belt_rank, payment_status } = req.query;
    let members;

    if (search) {
      members = await Member.search(search);
    } else {
      const filters = {};
      // Default to showing only active members unless explicitly specified
      if (active !== undefined) {
        filters.active = active === 'true';
      } else {
        filters.active = true;
      }
      if (belt_rank) filters.belt_rank = belt_rank;
      if (payment_status) filters.payment_status = payment_status;

      members = await Member.findAll(filters);
    }

    res.json({
      success: true,
      data: members,
      count: members.length
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /members/stats - Get member statistics
router.get('/stats', async (req, res) => {
  try {
    const [totalMembers, beltDistribution, paymentStatusSummary, currentMonthTotalPaid] = await Promise.all([
      Member.countActive(),
      Member.getBeltDistribution(),
      Member.getPaymentStatusSummary(),
      MemberPayment.getCurrentMonthTotal()
    ]);

    res.json({
      success: true,
      data: {
        total_members: totalMembers,
        belt_distribution: beltDistribution,
        payment_status_summary: paymentStatusSummary,
        current_month_total_paid: currentMonthTotalPaid
      }
    });
  } catch (error) {
    console.error('Error fetching member stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /members/:id - Get a specific member
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /members - Create a new member
router.post('/', validateMember, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const member = await Member.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: member
    });
  } catch (error) {
    console.error('Error creating member:', error);

    if (error.code === '23505') { // Unique violation (email)
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PATCH /members/:id - Update a member
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }

    // Use updateProfile for partial updates
    const member = await Member.updateProfile(id, updates);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member updated successfully',
      data: member
    });

  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /members/:id - Deactivate a member (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }

    const member = await Member.delete(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member deactivated successfully',
      data: member
    });
  } catch (error) {
    console.error('Error deactivating member:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PATCH /members/:id/promote - Promote member to next belt/stripe
router.patch('/:id/promote', async (req, res) => {
  try {
    const { id } = req.params;
    const { belt_rank, stripes, stripe_only } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }

    let member;

    if (stripe_only) {
      // Just add stripes
      member = await Member.addStripes(id, stripes || 1);
    } else {
      // Promote to specific belt and stripes
      if (!belt_rank) {
        return res.status(400).json({
          success: false,
          message: 'Belt rank is required for promotion'
        });
      }
      member = await Member.promoteToNextBelt(id, belt_rank, stripes || 0);
    }

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member promoted successfully',
      data: member
    });
  } catch (error) {
    console.error('Error promoting member:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PATCH /members/:id/payment-status - Update payment status
router.patch('/:id/payment-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }

    if (payment_status === 'overdue') {
      await MemberPayment.create(id, {
        payment_status: 'overdue',
        membership_plan_id: null,
        amount_paid: null,
        payment_date: null,
        notes: 'Status set to overdue'
      });
    } else {
      const plan = await db.query(
        'SELECT id, price FROM membership_plans WHERE active = true AND name = $1',
        [payment_status]
      );

      if (plan.rowCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'Payment status must be an active plan name or overdue'
        });
      }

      await MemberPayment.create(id, {
        payment_status: 'paid',
        membership_plan_id: plan.rows[0].id,
        amount_paid: plan.rows[0].price ?? null,
        payment_date: new Date().toISOString().slice(0, 10),
        notes: 'Status set from plan'
      });
    }

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: member
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;