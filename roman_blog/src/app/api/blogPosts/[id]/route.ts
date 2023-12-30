import BlogPost from "@/models/BlogPost";
import connect from "@/utils/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";
import { Readable } from "stream"; 
export const PUT = async (req:NextRequest,{params}:any)=>{
    const id = params.id;
    await connect();
    const storedBlogPost = await BlogPost.findById(id);
    const contentType = req.headers.get('Content-type')
    
    if(contentType?.includes('application/json')){
        //@ts-ignore
        const data = await req.json();
        try{
            await connect();
            const updatedBlogPost = await BlogPost.findByIdAndUpdate(id, data, {new:true});
            return new NextResponse(JSON.stringify(updatedBlogPost),{status:200})
        } catch(error){
            return new NextResponse("Nicht gefunden",{status:404})
        }
    } else{
        console.log("Ich kriege jetzt die Daten")
        const formdata = await req.formData();
        let images = formdata.getAll("images");
        let theme = formdata.get("theme");
        let author = formdata.get("author");
        let description = formdata.get("description");
        let content = formdata.get("content");
        console.log("images", images)
       
        //i go over the images so I can find out which one is a file
        const updates = images.map(async (image:any, index:any)=>{
            if(typeof image !== "string"){
                console.log("Bild",image)
                await cloudinary.uploader.destroy(storedBlogPost.cloudinaryIds[index])
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const readableStream = Readable.from(buffer)
        
                return new Promise((resolve, reject)=>{
                    let uploadstream = cloudinary.uploader.upload_stream({folder:"roman_blog"}, (error:any, result:any)=>{
                        if(error){
                            console.log(error)
                            reject(error)
                        } else{
                            resolve({secure_url: result.secure_url, public_id: result.public_id})
                        }
                    })
                    readableStream.pipe(uploadstream)
                }) 
            } else {
                // If the image is a string, return the old image URL and Cloudinary ID
                return {secure_url: image, public_id: storedBlogPost.cloudinaryIds[index]};
            }
        })
            
        try{
            const results:any = await Promise.all(updates);
            console.log("Results",results)
            const images = results.map((result:any) => result.secure_url);
            const cloudinaryIds = results.map((result:any) => result.public_id);
            const updateData = {
                theme: theme || storedBlogPost.theme,
                author: author || storedBlogPost.author,
                description: description || storedBlogPost.description,
                content: content || storedBlogPost.content,
                images: images,
                cloudinaryIds: cloudinaryIds,
            }
            const updatedBlogPost = await BlogPost.findByIdAndUpdate(id, updateData,{new:true})
            return new NextResponse(JSON.stringify(updatedBlogPost), {status:200})
        } catch(error){
            console.log(error)
            return new NextResponse("Nicht gefunden", {status:404})
        }
    }
}
export const DELETE = async (req:NextRequest, {params}:any)=>{
    const id = params.id;
    console.log(id)
    try{
        await connect();
        const storedBlogPost = await BlogPost.findById(id);
        const cloudinaryIds = storedBlogPost.cloudinaryIds;
        const secureUrls = storedBlogPost.images;
        //  await cloudinary.uploader.destroy(cloudinaryIds, secureUrls);
        await BlogPost.findByIdAndDelete(id);
        return new NextResponse(`Beitrag mit der Id:${id} wurde gelöscht`,{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}
export const GET = async (req:NextRequest, {params}:any)=>{
    const id = params.id;
    try{
        await connect();
        const getOneBlogPost = await BlogPost.findById(id);
        return new NextResponse(JSON.stringify(getOneBlogPost),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}