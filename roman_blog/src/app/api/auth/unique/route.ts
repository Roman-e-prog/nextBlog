import User from "@/models/User";
import connect from "@/utils/db";
import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req:NextRequest)=>{
    //@ts-ignore
    const data = await req.json();
    const {email, username, type} = data;
    if(req.method === 'POST'){
        await connect();
        if(type === "username"){
            const haveUsername =  await User.findOne({username:username}) 
            return new NextResponse(JSON.stringify(haveUsername))
        }
        if(type === "email"){
            const haveUserEmail = await User.findOne({email:email})
            return new NextResponse(JSON.stringify(haveUserEmail))
        }
    }
}
export {handler as POST, handler as GET}