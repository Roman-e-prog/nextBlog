import AdminMessage from "@/models/AdminMessage";
import connect from "@/utils/db";
import {NextRequest, NextResponse} from 'next/server';

export const PUT = async (req:NextRequest,{params}:any)=>{
    const data = await req.json();
    const id = params.id
    try{
        await connect();
        const updatedAdminMessage = await AdminMessage.findByIdAndUpdate(id, data,{new:true});
        return new NextResponse(JSON.stringify(updatedAdminMessage),{status:201})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:40})
    }
}
export const DELETE = async (req:NextRequest, {params}:any)=>{
    const id = params.id;
    try{
        await connect();
        await AdminMessage.findByIdAndDelete(id);
        return new NextResponse(`Nachricht mit der ID:${id} wurde gelöscht`,{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}
export const GET = async (req:NextRequest, {params}:any)=>{
    const id = params.id;
    try{
        await connect();
        const getAdminMessage = await AdminMessage.findById(id);
        return new NextResponse(JSON.stringify(getAdminMessage),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}