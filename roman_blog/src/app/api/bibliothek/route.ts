import Bibliothek from "@/models/Bibliothek";
import connect from "@/utils/db";
import { NextApiRequest } from "next";
import {NextRequest, NextResponse} from 'next/server';

export const POST = async (req:NextRequest)=>{
    //@ts-ignore
    const data = await req.json();
    const newBibliothek = new Bibliothek(data)
    try{
        await connect();
        const savedBibliothek = await newBibliothek.save();
        return new NextResponse(JSON.stringify(savedBibliothek),{status:201});
    } catch(error){
        return new NextResponse("Upload nicht möglich",{status:403})
    }
}
export const GET = async ()=>{
    try{
        await connect();
        const getAllBibliothek = await Bibliothek.find();
        return new NextResponse(JSON.stringify(getAllBibliothek),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}