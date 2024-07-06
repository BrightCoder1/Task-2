const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    tasks:[{
        type:String
    }],
    completed:[{
        type:Boolean,
        default:false
    }]
});

const Register = new mongoose.model("Register",userSchema);

module.exports = Register;