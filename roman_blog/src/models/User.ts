import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document{
    _id?:string,
    vorname:string,
    nachname:string,
    username:string,
    profilePicture:string,
    cloudinaryId:string,
    email:string,
    password:string,
    isAdmin:Boolean,
    createdAt:Date,
    updatedAt:Date,
}
const userSchema = new mongoose.Schema<UserDocument>({
    vorname:{type:String, required:true},
    nachname:{type:String, required:true},
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    profilePicture:{type:String},
    cloudinaryId:{type:String},
    password:{type:String, required:true},
    isAdmin:{type:Boolean, default:false}
},{timestamps:true})

export default mongoose.models.User || mongoose.model("User", userSchema, 'User')