const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");

router.post("/create", ticketController.createTicket);

router.get("/user/:userId", ticketController.getUserTickets);

// ✅ ADD THIS
router.get("/all", ticketController.getAllTickets);

router.get("/my", ticketController.getMyTickets);

router.put("/reply/:id", ticketController.replyTicket);

module.exports = router;