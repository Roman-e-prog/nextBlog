import Forum from "@/models/Forum";
import connect from "@/utils/db";
import { NextApiRequest } from "next";
import {NextRequest, NextResponse} from 'next/server';

export const POST = async (req:NextRequest)=>{
    //@ts-ignore
    const data = await req.json();
    const newForum = new Forum(data);
    try{
        await connect();
        const savedForum = await newForum.save();
        return new NextResponse(JSON.stringify(savedForum),{status:201})
    } catch(error){
        return new NextResponse("Kein Posting möglich",{status:403})
    }
}
export const GET = async ()=>{
    try{
        await connect();
        const getAllForum = await Forum.find();
        return new NextResponse(JSON.stringify(getAllForum),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}