const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({

    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:String,
        required:true,
    },
    storename:{
        type:String,
        required:true,
    },
    storeaddress:{
        type:String,
        required:true,
    },
    profileimage:{
        type:String,
        required:true,
    },
},
    { timestamps: true }
)

module.exports = mongoose.model("Profile",profileSchema);

