import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import connect from "@/utils/db";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import generateApiKey from 'generate-api-key';
const passGen = require('passgen');
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: '0.0.0.0',
    port:   1025,
})
const handler = async (req:NextApiRequest)=>{
    //@ts-ignore
    const data = await req.json();
    const {email, type, resetToken, password} = data;
    if(req.method === "POST"){
        if(type === "forgotten"){
            try{
                await connect();
                const user = await User.findOne({email:email});
                const token = passGen.create(22);;
                const newPasswordReset = new PasswordReset({
                    id: user._id,
                    token:token,
                })
                await newPasswordReset.save();
                const url = `http://localhost:3000/reset/${token}`
                console.log(url);
            await transporter.sendMail({
                from:'admin@example.com',
                to:email,
                subject:'Reset your password',
                html: `Klicken Sie<a href="${url}"> hier</a> um Ihr Passwort zu resetten`
            })
          return new NextResponse("Rufen Sie jetzt Ihr Email-Postfach auf")

            } catch(error){
                return new NextResponse("Benutzer nicht gefunden",{status:404})
            }
        }
        else if(type === 'reset'){
            await connect();
            const passwordReset = await PasswordReset.findOne({token:resetToken});
            console.log(passwordReset)
            const user = await User.findOne({_id:passwordReset.id});
            if(!user){
                return new NextResponse("User nicht gefunden");
            }
            const salt = await bcrypt.genSalt(10);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;
            await user.save();
            return new NextResponse("Passwort erfolgreich geändert")
        }
    }       
}
export {handler as POST, handler as GET}