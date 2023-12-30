import ForumThemes from "@/models/ForumThemes";
import connect from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const POST = async (req:NextApiRequest, res:NextApiResponse)=>{
    //@ts-ignore
    const data = await req.json();
    const newForumTheme = new ForumThemes(data);
    try{
        await connect();
        const savedForumThemes = await newForumTheme.save();
        return new NextResponse(JSON.stringify(savedForumThemes),{status:201})

    } catch(error){
        return new NextResponse("Hochladen des Themas nicht möglich", {status:403})
    }
}
export const GET = async (req:NextApiRequest, res:NextApiResponse)=>{
    try{
        await connect();
        const getAllForumThemes = await ForumThemes.find();
        return new NextResponse(JSON.stringify(getAllForumThemes),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden", {status:404})
    }
}