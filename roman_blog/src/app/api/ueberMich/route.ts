import UeberMich from "@/models/UeberMich";
import connect from "@/utils/db";
import {NextApiRequest} from 'next';
import {NextResponse} from 'next/server';

export const POST = async (req:NextApiRequest)=>{
    //@ts-ignore
    const data = await req.json();
    const newUeberMich = new UeberMich(data);
    try{
        await connect();
        const savedUeberMich = await newUeberMich.save();
        return new NextResponse(JSON.stringify(savedUeberMich), {status:201})
    } catch(error){
        return new NextResponse("Hochladen hat nicht funktioniert",{status:403})
    }
}
export const GET = async (req:NextApiRequest)=>{
    try{
        await connect();
        const getAllUeberMich = await UeberMich.find();
        return new NextResponse(JSON.stringify(getAllUeberMich),{status:200})
    } catch(error){
        return new NextResponse("Nicht gefunden",{status:404})
    }
}