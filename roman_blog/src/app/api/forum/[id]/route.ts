import Forum from "@/models/Forum";
import connect from "@/utils/db";
import {NextResponse, NextRequest} from 'next/server';

export const PUT = async (req:NextRequest,{params}:any)=>{
    //@ts-ignore
    const data = await req.json();
    const id = params.id;
    try{
        await connect();
        const updatedForum = await Forum.findByIdAndUpdate(id, data, {new:true});
        return new NextResponse(JSON.stringify(updatedForum),{status:200});
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}

export const DELETE = async (req:NextRequest, {params}:any)=>{
    const id = params.id;
    try{
        await connect();
        await Forum.findByIdAndDelete(id);
        return new NextResponse(`Forumbeitrag mit der Id:${id} wurde gelöscht`,{status:200});
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}

export const GET = async (req:NextRequest,{params}:any)=>{
    const id = params.id;
    try{
        await connect();
        const getForum = await Forum.findById(id);
        return new NextResponse(JSON.stringify(getForum),{status:200});
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}