import UserMessages from "@/models/UserMessages";
import connect from "@/utils/db";
import { NextRequest } from "next/server";
import {NextResponse} from 'next/server';

export const POST = async (req:NextRequest)=>{
    //@ts-ignore
    const data = await req.json();
    const newUserMessage = new UserMessages(data);
    try{
        await connect();
        const savedUserMessage = await newUserMessage.save();
        return new NextResponse(JSON.stringify(savedUserMessage),{status:201})
    } catch(error){
        return new NextResponse("Kein Posting möglich",{status:403})
    }
}
export const GET = async (req:NextRequest)=>{
    try{
        await connect();
        const getAllUserMessages = await UserMessages.find();
        return new NextResponse(JSON.stringify(getAllUserMessages),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}