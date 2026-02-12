const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const Member = require('../models/Contact'); // Will be renamed to Member model

const router = express.Router();

const isValidPaymentStatus = async (status) => {
  if (status === 'overdue') {
    return true;
  }

  const result = await db.query(
    'SELECT 1 FROM membership_plans WHERE active = true AND name = $1',
    [status]
  );
  return result.rowCount > 0;
};
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
  body('payment_class')
    .optional()
    .isIn(['evenings', 'mornings', 'both', 'coupon'])
    .withMessage('Payment class must be: evenings, mornings, both, or coupon'),
  body('payment_status')
    .optional()
    .custom(async (value) => {
      const valid = await isValidPaymentStatus(value);
      if (!valid) {
        throw new Error('Payment status must be an active plan name or overdue');
      }
      return true;
    }),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// GET /members - Get all members with optional filtering
router.get('/', async (req, res) => {
  try {
    const { search, active, belt_rank, payment_status, payment_class } = req.query;
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
      if (payment_class) filters.payment_class = payment_class;

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
    const beltDistribution = await Member.getBeltDistribution();
    const paymentStatusSummary = await Member.getPaymentStatusSummary();

    res.json({
      success: true,
      data: {
        belt_distribution: beltDistribution,
        payment_status_summary: paymentStatusSummary
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

    const isValid = await isValidPaymentStatus(payment_status);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment status must be an active plan name or overdue'
      });
    }

    const member = await Member.updatePaymentStatus(id, payment_status);

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