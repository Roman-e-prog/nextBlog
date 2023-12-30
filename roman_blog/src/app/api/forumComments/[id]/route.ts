import ForumComments from "@/models/ForumComments";
import connect from "@/utils/db";
import { NextRequest } from "next/server";
import {NextResponse} from 'next/server';

export const PUT = async (req:NextRequest,{params}:any)=>{
    const data = await req.json();
    const id = params.id
    try{
        await connect();
        const updatedForumComment = await ForumComments.findByIdAndUpdate(id, data,{new:true});
        return new NextResponse(JSON.stringify(updatedForumComment),{status:201})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:40})
    }
}
export const DELETE = async (req:NextRequest, {params}:any)=>{
    const id = params.id;
    try{
        await connect();
        await ForumComments.findByIdAndDelete(id);
        return new NextResponse(`Kommentar mit der ID:${id} wurde gelöscht`,{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}
export const GET = async (req:NextRequest, {params}:any)=>{
    const id = params.id;
    try{
        await connect();
        const getForumComment = await ForumComments.findById(id);
        return new NextResponse(JSON.stringify(getForumComment),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}