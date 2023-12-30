import mongoose from 'mongoose';
 export interface ForumDocument extends mongoose.Document{
    ressort:string,
    senderId:string,
    senderName:string,
    senderIsAdmin:boolean,
    senderProfilePicture:string,
    theme:string,
    question:string,
    likes:number,
    dislikes:number,
    views:number,
    solved:boolean,
    likeUserId:string[],
    dislikeUserId:string[],
    createdAt:Date,
    updatedAt:Date,
}
const forumSchema = new mongoose.Schema<ForumDocument>({
    ressort:{type:String, required:true},
    senderId:{type:String, required:true},
    senderName:{type:String, required:true},
    senderIsAdmin:{type:Boolean, default:false},
    senderProfilePicture:{type:String},
    theme:{type:String, required:true},
    question:{type:String, required:true},
    likes:{type:Number, default:0},
    dislikes:{type:Number, default:0},
    views:{type:Number, default:0},
    solved:{type:Boolean, default:false},
    likeUserId: {type: [String], default: []},
    dislikeUserId: {type: [String], default: []},
},{timestamps:true})
export default mongoose.models.Forum || mongoose.model("Forum", forumSchema, 'Forum')