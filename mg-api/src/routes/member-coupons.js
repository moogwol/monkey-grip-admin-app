const express = require('express');
const ClassCoupon = require('../models/ClassCoupon');

const router = express.Router();

// POST /members/:id/coupon/top-up - Create or top-up a member coupon by member ID
router.post('/:id/coupon/top-up', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      classes,
      amount_paid,
      expiry_date,
      notes,
      active = true
    } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }

    if (!Number.isInteger(classes) || classes < 1) {
      return res.status(400).json({
        success: false,
        message: 'Classes must be a positive integer'
      });
    }

    if (amount_paid !== undefined && (typeof amount_paid !== 'number' || amount_paid < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Amount paid must be a number greater than or equal to 0'
      });
    }

    const coupon = await ClassCoupon.create({
      member_id: parseInt(id),
      total_classes: classes,
      classes_remaining: classes,
      expiry_date,
      amount_paid,
      notes,
      active
    });

    res.json({
      success: true,
      message: `Added ${classes} class(es) to member coupon`,
      data: coupon
    });
  } catch (error) {
    console.error('Error topping up member coupon:', error);

    if (error.code === '23503') {
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

// GET /members/:id/coupons - Get all coupons for a specific member
router.get('/:id/coupons', async (req, res) => {
  try {
    const { id } = req.params;
    const { active_only = 'true' } = req.query;
    
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }
    
    const coupons = await ClassCoupon.findByMemberId(
      parseInt(id), 
      active_only === 'true'
    );
    
    res.json({
      success: true,
      data: coupons,
      count: coupons.length
    });
  } catch (error) {
    console.error('Error fetching member coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /members/:id/coupon-summary - Get coupon summary for a member
router.get('/:id/coupon-summary', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }
    
    const summary = await ClassCoupon.getMemberCouponSummary(parseInt(id));
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching member coupon summary:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;