import mongoose from 'mongoose';
export interface AdminMessageDocument extends mongoose.Document{
    questionId:string,
    adminId:string,
    adminname:string,
    senderId:string,
    senderName:string,
    adminMessage:string,
    createdAt:Date,
    updatedAt:Date,
}
const adminMessageSchema = new mongoose.Schema<AdminMessageDocument>({
    questionId:{type:String, required:true},
    adminId:{type:String, required:true},
    adminname:{type:String, required:true},
    senderId:{type:String, required:true},
    senderName:{type:String, required:true},
    adminMessage:{type:String, required:true},
},{timestamps:true})

export default mongoose.models.AdminMessage || mongoose.model("AdminMessage", adminMessageSchema, 'AdminMessage');