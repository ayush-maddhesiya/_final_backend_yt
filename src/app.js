import Express  from "express";
const app = Express();
import cookieParser from "cookie-parser";
import cors from 'cors'

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(Express.json({ limit: "16kb"}))
app.use(Express.urlencoded({extended: true, limit : "16kb"}))
app.use(Express.static("public"))
app.use(cookieParser())


//router import 
import userRoute from "./routes/user.router.js"


//router declartion:
app.use("/api/v1/users",userRoute)

export default app;