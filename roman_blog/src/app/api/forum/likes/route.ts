import Forum from "@/models/Forum";
import connect from "@/utils/db";
import { NextApiRequest } from "next";
import {NextRequest, NextResponse } from "next/server";

const handler = async (req:NextRequest)=>{
    if(req.method === "POST"){
        //@ts-ignore
        const data = await req.json();
        const {id, type, likeUserId} = data;

        if(type === "views"){
            try{
                await connect();
                await Forum.findOneAndUpdate({_id:id}, {$inc:{views:1}})
                return new NextResponse("Beitrag wurde gesehen")
            } catch(error){
                return new NextResponse("Nicht gefunden",{status:404})
            }
        }
        else if(type === "likes"){
            try{
                await connect();
                await Forum.findOneAndUpdate({_id:id}, {$inc:{likes:1}, $addToSet:{likeUserId:likeUserId}});
                return new NextResponse("Beitrag hat gefallen")
            } catch(error){
                return new NextResponse("Nicht gefunden",{status:404})
            }
        }
        else if(type === "dislikes"){
            try{
                await connect();
                await Forum.findOneAndUpdate({_id:id}, {$inc:{dislikes:1}, $addToSet:{dislikeUserId:likeUserId}}, );
                return new NextResponse("Beitrag hat nicht gefallen")
            } catch(error){
                return new NextResponse("Nicht gefunden",{status:404})
            }
        }
    }
}
export {handler as POST, handler as GET};