import dotenv from "dotenv"
import connectionDb from "./src/db/db_connection.js";
import { app } from "./src/app.js";

dotenv.config(
    {
        path:"./env"
    }
)
connectionDb().then(app.listen(process.env.PORT||8000,()=>{
    console.log(`app is listening on ${process.env.PORT}`);
    
}))