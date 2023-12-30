import UserMessages from "@/models/UserMessages";
import connect from "@/utils/db";
import { NextApiRequest } from "next";
import {NextResponse} from 'next/server';

export const PUT = async (req:NextApiRequest,{params}:any)=>{
    //@ts-ignore
    const data = await req.json();
    const id = params.id
    try{
        await connect();
        const updatedUserMessage = await UserMessages.findByIdAndUpdate(id, data,{new:true});
        return new NextResponse(JSON.stringify(updatedUserMessage),{status:201})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:40})
    }
}
export const DELETE = async ({params}:any)=>{
    const id = params.id;
    try{
        await connect();
        await UserMessages.findByIdAndDelete(id);
        return new NextResponse(`Nachricht mit der ID:${id} wurde gelöscht`,{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}
export const GET = async ({params}:any)=>{
    const id = params.id;
    try{
        await connect();
        const getUserMessage = await UserMessages.findById(id);
        return new NextResponse(JSON.stringify(getUserMessage),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}