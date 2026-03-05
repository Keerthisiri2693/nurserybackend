const mongoose = require("mongoose");

const customerprofileSchema = new mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    unique:true
  },

  name:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true
  },

  mobileNo:{
    type:String,
    required:true
  },

  profileImage:{
    type:String,
    default:""
  }

},{timestamps:true});

module.exports = mongoose.model("customerprofile",customerprofileSchema);