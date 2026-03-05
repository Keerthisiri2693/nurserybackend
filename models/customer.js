const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({

    fullname:{type:String,required:true},
    
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },


},

{ timestamps: true }
);

module.exports = mongoose.model("customer",customerSchema);