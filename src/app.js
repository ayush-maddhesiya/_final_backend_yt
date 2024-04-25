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
import tweetRouter from "./routes/tweet.router.js"
import playlistRouter from "./routes/playlist.router.js"
import videoRouter  from "./routes/video.router.js";
import commentRouter from "./routes/comment.router.js"
//router declartion:
// app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users",userRoute)
app.use("/api/v1/tweets", tweetRouter)
// app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
// app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
// app.use("/api/v1/dashboard", dashboardRouter)

export default app;