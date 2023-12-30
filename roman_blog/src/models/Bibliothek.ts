import mongoose from 'mongoose';
export interface BibliothekDocument extends mongoose.Document{
    videos:{
        ressort:string,
        file:string,
        content:string,
    }[];
    createdAt:Date,
    updatedAt:Date,
}
const bibliothekSchema = new mongoose.Schema<BibliothekDocument>({
    videos:{type:[{type:Object}], required:true}
},{timestamps:true})

export default mongoose.models.Bibliothek || mongoose.model("Bibliothek", bibliothekSchema, 'Bibliothek');