import BlogPost from "@/models/BlogPost";
import connect from "@/utils/db";
import {NextRequest} from 'next/server';
import { NextResponse } from "next/server";
import { Readable } from 'stream';
import cloudinary from '../../../utils/cloudinary'

export const POST = async (req:NextRequest)=>{
    const contentType = req.headers.get('Content-type')
    if(contentType?.includes('application/json')){     
        //@ts-ignore
        const data = await req.json();
        const newBlogPost = new BlogPost(data);
        try{
            await connect();
            const savedBlogPost = await newBlogPost.save()
            return new NextResponse(JSON.stringify(savedBlogPost),{status:201})
        } catch(error){
            return new NextResponse("Kein Upload möglich",{status:403})
        }
        
    } else{
        //@ts-ignore
        const formdata = await req.formData();
        let theme = formdata.get("theme");
        let author = formdata.get("author")
        let description = formdata.get("description")
        let content = formdata.get("content")
        let images = formdata.getAll("images");
        const uploads = images.map(async (image:any) => {
            // Create a buffer from the image
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            //readableStream to have an instance of the file;
            let readableStream = Readable.from(buffer);
            //stream with Cloudinary
            //@ts-ignore
            return new Promise((resolve, reject) => {
                let uploadStream = cloudinary.uploader.upload_stream({folder: 'roman_blog'},(error:any, result:any) => {
                    if (error) {
                        reject(error);
                    } else {
                        // Resolve the promise with the secure_url and public_id
                        resolve({secure_url: result.secure_url, public_id: result.public_id});
                    }
                });
                // Pipe the readable stream to the upload stream
                readableStream.pipe(uploadStream);
            });
        });
    
        try {
            const results = await Promise.all(uploads);
            //@ts-ignore
            const secureUrls = results.map(result => result.secure_url);
            //@ts-ignore
            const cloudinaryIds = results.map(result => result.public_id);
    
            const newBlogPost = new BlogPost({
                theme,
                author, 
                description, 
                content,
                images:secureUrls,
                cloudinaryIds:cloudinaryIds,
            })
            await connect();
            const savedBlogPost = await newBlogPost.save();
            return new NextResponse(savedBlogPost, {status:201})
        } catch(error){
            return new NextResponse("Kein Upload möglich",{status:403})
        }

    }
}

export const GET = async (req:NextRequest)=>{
    try{
        await connect();
        const getAllBlogPosts = await BlogPost.find();
        return new NextResponse(JSON.stringify(getAllBlogPosts),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }

}