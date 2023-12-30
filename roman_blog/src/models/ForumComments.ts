import mongoose, { model } from 'mongoose';
export interface ForumCommentsDocument extends mongoose.Document{
    questionId:string,
    senderName:string,
    senderId:string,
    senderProfilePicture:string,
    answer:string,
    answerId?:string,
    answererName?:string,
    likes:number,
    dislikes:number,
    hasSolved:boolean,
    likeUserId:string[],
    dislikeUserId:string[],
    createdAt:Date,
    updatedAt:Date,
}
const forumCommentsSchema = new mongoose.Schema<ForumCommentsDocument>({
    questionId:{type:String, required:true},
    senderName:{type:String, required:true},
    senderId:{type:String, required:true},
    senderProfilePicture:{type:String},
    answer:{type:String, required:true},
    answerId:{type:String},
    answererName:{type:String},
    likes:{type:Number, default:0},
    dislikes:{type:Number, default:0},
    hasSolved:{type:Boolean, default:false},
    likeUserId:{type:[String], default:[]},
    dislikeUserId:{type:[String], default:[]},
},{timestamps:true})

export default mongoose.models.ForumComments || mongoose.model("ForumComments", forumCommentsSchema, 'ForumComments');