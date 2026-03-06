const express = require("express");
const router = express.Router();

const {
  addAddress,
  getUserAddresses,
  deleteAddress,
} = require("../controllers/addressController");

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address management APIs
 */

/**
 * @swagger
 * /api/address/add:
 *   post:
 *     summary: Add a new address
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pincode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address added successfully
 */
router.post("/add", addAddress);

/**
 * @swagger
 * /api/address/{userId}:
 *   get:
 *     summary: Get all addresses for a user
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address list fetched successfully
 */
router.get("/:userId", getUserAddresses);

/**
 * @swagger
 * /api/address/{addressId}:
 *   delete:
 *     summary: Delete address
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         description: Address ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 */
router.delete("/:addressId", deleteAddress);

module.exports = router;