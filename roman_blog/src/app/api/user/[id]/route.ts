import User from "@/models/User";
import connect from "@/utils/db";
import { NextRequest } from "next/server";
import {NextResponse} from 'next/server';
import cloudinary from "@/utils/cloudinary";
import { Readable } from "stream";
export const PUT = async (req:NextRequest,{params}:any)=>{
    const id = params.id;
    const contentType = req.headers.get('Content-Type');
   
    if(contentType?.includes('application/json')){
        try{
            await connect();
        //@ts-ignore
        const data = req.json();
        const updatedUser = await User.findByIdAndUpdate(id, data, {new:true});
        return new NextResponse(JSON.stringify(updatedUser),{status:200})
        } catch(error){
            return new NextResponse("Nicht gefunden",{status:404});
        }
    } 
    else {
        const formdata = await req.formData();
        const storedUser = await User.findById(id);
        const vorname = formdata.get("vorname");
        const nachname = formdata.get("nachname");
        const profilePicture:File  = formdata.get("profilePicture") as unknown as File;
        const bytes = await profilePicture!.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const readable = Readable.from(buffer);

        const result = new Promise((resolve, reject)=>{
            const uploadStream = cloudinary.uploader.upload_stream({folder:'roman_blog'},(error:any, result:any)=>{
                if(error){
                    reject(error)
                } else{
                    resolve({secure_url: result.secure_url, public_id: result.public_id})
        }});
            readable.pipe(uploadStream);
        });
        try{
            const profilePicture = await result.then((data:any)=>data.secure_url)
            const cloudinaryId = await result.then((data:any)=>data.public_id)

            const newUser = {
                vorname:vorname || storedUser.vorname,
                nachname: nachname || storedUser.nachname,
                profilePicture:profilePicture,
                cloudinaryId:cloudinaryId,
            }
            const updatedUser = await User.findByIdAndUpdate(id, newUser, {new:true})
            return new NextResponse(JSON.stringify(updatedUser),{status:200});
        } catch(error){
            return new NextResponse("Nicht gefunden",{status:404});
        }
    }
}
export const DELETE = async (req:NextRequest, {params}:any)=>{
    const id = params.id;
    try{
        await connect();
        await User.findByIdAndDelete(id);
        return new NextResponse(`Der Account mit der Id:${id} wurde gelöscht`,{status:200});
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404});
    }
}
export const GET = async (req:NextRequest, {params}:any)=>{
    const id = params.id;
    try{
        await connect();
        const getUser = await User.findById(id);
        return new NextResponse(JSON.stringify(getUser),{status:200});
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404});
    }
}
