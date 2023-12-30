import ForumComments from "@/models/ForumComments";
import connect from "@/utils/db";
import { NextApiRequest } from "next";
import {NextResponse} from 'next/server';

export const POST = async (req:NextApiRequest)=>{
    //@ts-ignore
    const data = await req.json();
    console.log(data);
    const newForumComment = new ForumComments(data);
    try{
        await connect();
        const savedForumComment = await newForumComment.save();
        return new NextResponse(JSON.stringify(savedForumComment),{status:201})
    } catch(error){
        console.log(error)
        return new NextResponse("Kein Posting möglich",{status:403})
    }
}
export const GET = async ()=>{
    console.log("are there no headers")
    try{
        await connect();
        const getAllForumComments = await ForumComments.find();
        return new NextResponse(JSON.stringify(getAllForumComments),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}