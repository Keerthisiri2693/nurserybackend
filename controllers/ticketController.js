const Ticket = require("../models/Ticket");
const jwt = require("jsonwebtoken");


/* ================= CREATE TICKET ================= */

exports.createTicket = async (req, res) => {

  try {

    const { subject, message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const ticket = await Ticket.create({
      userId,
      subject,
      message
    });

    res.json({
      success: true,
      ticket
    });

  } catch (error) {

    console.log("Create ticket error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};



/* ================= GET USER TICKETS (BY PARAM) ================= */

exports.getUserTickets = async (req, res) => {

  try {

    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID required"
      });
    }

    const tickets = await Ticket.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets
    });

  } catch (error) {

    console.log("User ticket fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};



/* ================= GET MY TICKETS (TOKEN BASED) ================= */

exports.getMyTickets = async (req, res) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;

    const tickets = await Ticket.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets
    });

  } catch (error) {

    console.log("Get my tickets error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};



/* ================= SELLER REPLY ================= */

exports.replyTicket = async (req, res) => {

  try {

    const { reply, status } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { reply, status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    res.json({
      success: true,
      ticket
    });

  } catch (error) {

    console.log("Reply ticket error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};


exports.getAllTickets = async (req,res)=>{

try{

const tickets = await Ticket.find()
.sort({createdAt:-1});

res.json({
success:true,
tickets
});

}catch(error){

console.log("Get tickets error:",error);

res.status(500).json({
success:false,
message:"Server error"
});

}

};