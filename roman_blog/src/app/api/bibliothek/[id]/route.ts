import Bibliothek from "@/models/Bibliothek";
import connect from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";

export const PUT = async (req:NextRequest,{params}:any)=>{
    const data = await req.json()
    const id = params.id;
    try{
        await connect();
        const updatedBibliothek = await Bibliothek.findByIdAndUpdate(id, data, {new:true});
        return new NextResponse(JSON.stringify(updatedBibliothek),{status:200})
    } catch (error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}
export const DELETE = async (req:NextRequest, {params}:any)=>{
    const id = params.id;
    try{
        await connect();
        await Bibliothek.findByIdAndDelete(id);
        return new NextResponse(`Die Bibliothek ${id} wurde gelöscht`,{status:200})
    } catch (error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}
export const GET = async (req:NextRequest, {params}:any)=>{
    const id = params.id;
    try{
        await connect();
        const getBibliothek = await Bibliothek.findById(id);
        return new NextResponse(JSON.stringify(getBibliothek),{status:200})
    } catch (error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}