import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectionDb= async ()=>{
    try {
      const a = await  mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
      console.log("Db is connected ");
      
    } catch (error) {
        console.log("DB connection Faild",error);
        throw error;
        
    }
}
export default connectionDb