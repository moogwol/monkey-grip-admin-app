const express = require("express");
const db = require("../database");
const router = express.Router();

// Get all active payment plans
router.get("/", async (req, res) => {
    const query = "SELECT * FROM membership_plans WHERE active = true";
    try {
        const result = await db.query(query);
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error("Error fetching payment plans:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get a payment plan by id
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment plan ID"
        });
    }

    const query = "SELECT * FROM membership_plans WHERE id = $1";
    try {
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment plan not found"
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error fetching payment plan:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Add a new payment plan
router.post("/", async (req, res) => {
    const { name, price, description, active, is_coupon_plan } = req.body;
    const query = "INSERT INTO membership_plans (name, price, description, active, is_coupon_plan) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    try {
        const result = await db.query(query, [name, price, description, active, is_coupon_plan]);
              
        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error adding payment plan:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

module.exports = router;