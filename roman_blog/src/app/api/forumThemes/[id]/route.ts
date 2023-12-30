import ForumThemes from "@/models/ForumThemes";
import connect from "@/utils/db";
import {NextResponse, NextRequest} from 'next/server';

export const PUT = async (req:NextRequest, {params}:any)=>{
    const id = params.id;
    const data = await req.json();
    try{
        await connect();
        const updatedForumTheme = await ForumThemes.findByIdAndUpdate(id, data,{new:true})
        return new NextResponse(JSON.stringify(updatedForumTheme),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden", {status:404})
    }
}
export const DELETE = async (req:NextRequest,{params}:any)=>{
    const id = params.id;
    try{
        await connect();
        await ForumThemes.findByIdAndDelete(id);
        return new NextResponse(`ForumTheme mit der id:${id} wurde gelöscht`,{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}
export const GET = async (req:NextRequest, {params}:any)=>{
        const id = params.id;
    try{
        await connect();
        const getForumTheme = await ForumThemes.findById(id);
        return new NextResponse(JSON.stringify(getForumTheme),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}