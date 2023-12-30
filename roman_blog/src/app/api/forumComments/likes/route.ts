import ForumComments from "@/models/ForumComments";
import Forum from "@/models/Forum";
import connect from "@/utils/db";
import {NextApiRequest} from 'next';
import {NextResponse} from 'next/server';

const handler = async (req:NextApiRequest)=>{
    if(req.method === "POST"){
         //@ts-ignore
        const data = await req.json();
        const {id, type, questionId, likeUserId} = data;
        console.log(id, type, questionId, likeUserId)
        if(type === "solved"){
            try{
                await connect();
                await ForumComments.findOneAndUpdate({_id:id}, {$set:{hasSolved:true}});
                await Forum.findOneAndUpdate({_id: questionId}, {$set:{solved:true}})
                return new NextResponse("Diese Antwort war richtig")
            } catch(error){
                return new NextResponse("Nicht gefunden", {status:404})
            }  
        }
        else if(type === "likes"){
            try{
            await connect();
            await ForumComments.findOneAndUpdate({_id:id}, {$inc:{likes:1}, $addToSet:{likeUserId:likeUserId}})
            return new NextResponse("Diese Antwort hat mir gefallen")
            } catch(error){
                return new NextResponse("Nicht gefunden", {status:404})
            }  
        }
        else if(type === "dislikes"){
            try{
            await connect();
            await ForumComments.findOneAndUpdate({_id:id}, {$inc:{dislikes:1}, $addToSet:{dislikeUserId:likeUserId}})
            return new NextResponse("Diese Antwort hat mir nicht gefallen")
            } catch(error){
                return new NextResponse("Nicht gefunden", {status:404})
            }  
        }
    }
}

export {handler as POST, handler as GET}