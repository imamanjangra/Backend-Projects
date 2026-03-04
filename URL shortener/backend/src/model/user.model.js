import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const UserModel = new Schema({
    FullName :
    {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        index: true
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true
    },
    refreshToken : {
        type : String,
    }
} , {timestamps : true});

UserModel.index({
    _id : 1 , createdAt: 1 
})
UserModel.pre("save" , async function () {
  if(!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password , 10); 
})

UserModel.methods.isPassworCorrect = async function(password) {
   return await bcrypt.compare(password , this.password)
}   

UserModel.methods.generateAccessToken = function() {
    return jwt.sign({

        _id : this._id,
        email : this.email,
        username : this.username,
        email : this.email
    } , 
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })
}
/*
jwt -> is a string use to securly transmetion info b/w two parties -> like client <---> server 
it have a three part 
1) header -> algo , type
2) paylode -> data 
3) signature -> verification 
jwt -> header.paylode.signature


*/
UserModel.methods.generateRefreshToken = function() {
    return jwt.sign(
        {_id : this._id},// paylode
        process.env.REFRESH_TOKEN_SECRET,// secret
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY// expiry
        }
    )
}

export const User = mongoose.model("User" , UserModel);