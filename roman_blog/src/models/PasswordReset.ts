import mongoose from 'mongoose';
export interface PasswordResetDocument extends mongoose.Document{
    id:string,
    token:string,
}
const PasswordResetSchema = new mongoose.Schema<PasswordResetDocument>({
    id:{type:String, required:true},
    token:{type:String, required:true},
})
export default mongoose.models.PasswordReset || mongoose.model("PasswordReset", PasswordResetSchema, 'PasswordReset');