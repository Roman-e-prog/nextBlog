import mongoose from 'mongoose';
export interface UeberMichDocument extends mongoose.Document{
    myPerson:string,
    createdAt:Date,
    updatedAt:Date,
}
const ueberMichSchema = new mongoose.Schema<UeberMichDocument>({
    myPerson:{type:String, required:true},
},{timestamps:true})

export default mongoose.models.UeberMich || mongoose.model("UeberMich", ueberMichSchema, 'UeberMich');