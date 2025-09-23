const express = require('express');
const { body, validationResult } = require('express-validator');
const ClassCoupon = require('../models/ClassCoupon');

const router = express.Router();

// Validation middleware for coupon data
const validateCoupon = [
  body('member_id')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('Valid member ID is required'),
  body('total_classes')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Total classes must be between 1 and 100'),
  body('classes_remaining')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Classes remaining must be 0 or greater'),
  body('purchase_date')
    .optional()
    .isISO8601()
    .withMessage('Purchase date must be a valid date'),
  body('expiry_date')
    .optional()
    .isISO8601()
    .withMessage('Expiry date must be a valid date'),
  body('amount_paid')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount paid must be 0 or greater'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// GET /coupons - Get all coupons with optional filtering
router.get('/', async (req, res) => {
  try {
    const { member_id, active, expired } = req.query;
    const filters = {};
    
    if (member_id) filters.member_id = parseInt(member_id);
    if (active !== undefined) filters.active = active === 'true';
    if (expired !== undefined) filters.expired = expired === 'true';
    
    const coupons = await ClassCoupon.findAll(filters);
    
    res.json({
      success: true,
      data: coupons,
      count: coupons.length
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /coupons/stats - Get coupon statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await ClassCoupon.getCouponStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching coupon stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /coupons/expiring - Get coupons expiring soon
router.get('/expiring', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const expiringCoupons = await ClassCoupon.getExpiringCoupons(parseInt(days));
    
    res.json({
      success: true,
      data: expiringCoupons,
      count: expiringCoupons.length
    });
  } catch (error) {
    console.error('Error fetching expiring coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /coupons/:id - Get a specific coupon
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon ID'
      });
    }
    
    const coupon = await ClassCoupon.findById(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /coupons - Create a new coupon
router.post('/', validateCoupon, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }
    
    const coupon = await ClassCoupon.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    
    if (error.code === '23503') { // Foreign key violation (member_id)
      return res.status(400).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /coupons/:id - Update a coupon
router.put('/:id', validateCoupon, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon ID'
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
    
    // Remove member_id from update data as it shouldn't be changed
    const { member_id, ...updateData } = req.body;
    
    const coupon = await ClassCoupon.update(id, updateData);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PATCH /coupons/:id/use - Use classes from a coupon
router.patch('/:id/use', async (req, res) => {
  try {
    const { id } = req.params;
    const { classes = 1 } = req.body;
    
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon ID'
      });
    }
    
    if (!Number.isInteger(classes) || classes < 1) {
      return res.status(400).json({
        success: false,
        message: 'Classes must be a positive integer'
      });
    }
    
    const coupon = await ClassCoupon.useClass(id, classes);
    
    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: 'Cannot use coupon - may be inactive, expired, or have no remaining classes'
      });
    }
    
    res.json({
      success: true,
      message: `Used ${classes} class(es) from coupon`,
      data: coupon
    });
  } catch (error) {
    console.error('Error using coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PATCH /coupons/:id/add-classes - Add classes to an existing coupon
router.patch('/:id/add-classes', async (req, res) => {
  try {
    const { id } = req.params;
    const { classes } = req.body;
    
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon ID'
      });
    }
    
    if (!Number.isInteger(classes) || classes < 1) {
      return res.status(400).json({
        success: false,
        message: 'Classes must be a positive integer'
      });
    }
    
    const coupon = await ClassCoupon.addClasses(id, classes);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.json({
      success: true,
      message: `Added ${classes} class(es) to coupon`,
      data: coupon
    });
  } catch (error) {
    console.error('Error adding classes to coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PATCH /coupons/:id/deactivate - Deactivate a coupon
router.patch('/:id/deactivate', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon ID'
      });
    }
    
    const coupon = await ClassCoupon.deactivate(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Coupon deactivated successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Error deactivating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /coupons/:id - Delete a coupon
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon ID'
      });
    }
    
    const coupon = await ClassCoupon.delete(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Coupon deleted successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;