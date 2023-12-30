import mongoose from 'mongoose';
export interface BlogPostDocument extends mongoose.Document{
    theme:string,
    author:string,
    description:string,
    content:string,
    images:[],
    cloudinaryIds:[],
    createdAt:Date,
    updatedAt:Date,
}
const blogPostSchema = new mongoose.Schema<BlogPostDocument>({
    theme:{type:String, required:true},
    author:{type:String, required:true},
    description:{type:String, required:true},
    content:{type:String, required:true},
    images:{type:[{type:String}], required:true},
    cloudinaryIds:{type:[{type:String}], required:true},
},{timestamps:true})

export default mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema, 'BlogPost');