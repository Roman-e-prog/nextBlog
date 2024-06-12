import User from "@/models/User";
import connect from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
export const POST = async (req:NextRequest, res:NextResponse)=>{
    //@ts-ignore
    const data = await req.json();
    const {vorname, nachname, username, email, password} = data;
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({
        vorname,
        nachname,
        username,
        email,
        password:hash,
    })
    try{
        await connect();
        const savedUser = await newUser.save();
        console.log(savedUser)
        return new NextResponse(JSON.stringify(savedUser),{status:201});
    } catch(error:any){
        console.log(error)
        return new NextResponse(error.message,{status:403})
    }
}