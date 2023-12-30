import AdminMessage from "@/models/AdminMessage";
import UserMessages from "@/models/UserMessages";
import connect from "@/utils/db";
import { NextRequest } from "next/server";
import {NextResponse} from 'next/server';

export const POST = async (req:NextRequest)=>{
    //@ts-ignore
    const data = await req.json();
    const newAdminMessage = new AdminMessage(data);
    try{
        await connect();
        const savedAdminMessage = await newAdminMessage.save();
        await UserMessages.findOneAndUpdate({_id:data.questionId},{$set:{isAnswered:true}})
        return new NextResponse(JSON.stringify(savedAdminMessage),{status:201})
    } catch(error){
        return new NextResponse("Kein Posting möglich",{status:403})
    }
}
export const GET = async (req:NextRequest)=>{
    try{
        await connect();
        const getAllAdminMessages = await AdminMessage.find();
        return new NextResponse(JSON.stringify(getAllAdminMessages),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}