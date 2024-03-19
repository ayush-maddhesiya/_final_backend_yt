//require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import app from './app.js'

import connectDB from "./db/index.js";
dotenv.config({
    path: './.env'
})

const port = 8181;

connectDB()
.then(()=>{
    app.listen(port ,()=>{
        console.log(`Server is lintening on port : ${8181}`);

    })
})
.catch((error)=>{
    console.error("Mongoose contion failed",error)
})



// ( async ()=>{
    // try {
        // await connect.mongoose(`${process.env.MONGO_URL}/${DB_NAME}`)
        // app.on("error",(error)=>{
            // console.log("Error", error);
            // throw error
        // })
// 
        // app.listen(process.env.PORT,()=>{
            // console.log(`Server is running on PORT ${process.env.PORT}`);
        // })
// 
    // } catch (error) {
        // console.log("ERROR",error);
        // throw error;
    // }
// })()