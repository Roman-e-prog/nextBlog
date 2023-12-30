import mongoose from 'mongoose';
export interface ForumThemesDocument extends mongoose.Document{
    theme:string,
    content:string,
    createdAt:Date,
    updatedAt:Date,
}
const forumThemeSchema = new mongoose.Schema<ForumThemesDocument>({
    theme:{type:String, required:true},
    content:{type:String, required:true},
},{timestamps:true})

export default mongoose.models.ForumTheme || mongoose.model("ForumTheme", forumThemeSchema, 'ForumTheme');