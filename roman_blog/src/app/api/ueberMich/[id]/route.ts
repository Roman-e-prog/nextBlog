import UeberMich from "@/models/UeberMich";
import connect from "@/utils/db";
import {NextResponse, NextRequest} from 'next/server';

export const PUT = async (req:NextRequest,{params}:any)=>{
    const id = params.id;
    const data = await req.json();
    try{
        await connect();
        const updatedUeberMich = await UeberMich.findByIdAndUpdate(id, data, {new:true});
        return new NextResponse(JSON.stringify(updatedUeberMich),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}
export const DELETE = async (req:NextRequest, {params}:any)=>{
    const id = params.id;
    try{
        await connect();
        await UeberMich.findByIdAndDelete(id);
        return new NextResponse(`Beitrag mit der id ${id} wurde gelöscht`,{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}
export const GET = async (req:NextRequest,{params}:any)=>{
    const id = params.id;
    try{
        await connect();
        const getUeberMich = await UeberMich.findById(id);
        return new NextResponse(JSON.stringify(getUeberMich),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}