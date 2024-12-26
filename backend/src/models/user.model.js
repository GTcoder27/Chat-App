import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
        },
        fullname:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
            minlength:6,
        },
        pic:{
            type:String,
            default:"https://www.citypng.com/public/uploads/preview/white-user-member-guest-icon-png-image-701751695037005zdurfaim0y.png"
        },
    },
    { timestamps : true}
);

const User = mongoose.model("User",userSchema);

export default User;






