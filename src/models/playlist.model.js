import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
    name:{
        type: String,
        require: true
    },
    discription:{
        type: String,
        require: true
    },
    videos:{
        type: Schema.Types.ObjectId,
        ref:"Video"
    },
    onwer:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},{timeseries: true})

export const Playlist = new mongoose.model("Playlist",playlistSchema)