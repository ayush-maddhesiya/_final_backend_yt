import mongoose ,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subcriber:{
        type: Schema.Types.ObjectId,//one who subcribes
        ref: "User"
    },
    channel:{
        type: Schema.Types.ObjectId,//one to whom we  subcribes
        ref: "User"
    }
},{timestamps: true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)