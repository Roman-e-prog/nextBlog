import mongoose from 'mongoose';
export interface UserMessagesDocument extends mongoose.Document{
    senderId:string,
    senderName:string,
    userMessage:string,
    isAnswered:boolean,
    createdAt:Date,
    updatedAt:Date,
}
const userMessagesSchema = new mongoose.Schema<UserMessagesDocument>({
    senderId:{type:String, required:true},
    senderName:{type:String, required:true},
    userMessage:{type:String, required:true},
    isAnswered:{type:Boolean, default:false},
},{timestamps:true})

export default mongoose.models.UserMessages || mongoose.model("UserMessages", userMessagesSchema, 'UserMessages');