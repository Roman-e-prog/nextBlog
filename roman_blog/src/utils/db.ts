import mongoose from "mongoose";

const connect = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL as string);
        console.log(`Successfull connected to ${conn.connection.host}`);
    } catch(error){
        console.log(error)
    }

}
export default connect;