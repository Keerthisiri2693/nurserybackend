const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  subject:String,
  message:String,

  status:{
    type:String,
    default:"open"
  },

  reply:{
    type:String,
    default:""
  }

},{timestamps:true});

module.exports = mongoose.model("Ticket",ticketSchema);