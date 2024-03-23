import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    content:{
        type: String,
        require: true
    },
    video:{
        type: Schema.Types.ObjectId,
        ref:"Video"
    },
    onwer:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},{timeseries: true})

export const Comment = mongoose.model("Comment",commentSchema)