import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    try {
        if(!channelId){
            throw new ApiError(404,"Channel id is requiered!!")
        }
        const {userID} = User._id
        const ifSub  = await Subscription.findOne({channel: channelId, subcriber: userID})
        if(!ifSub){
            const sub = await Subscription.findOne({channel: channelId, subcriber: userID})
            return res.status(200).json(
                new ApiResponse(200,sub,"Channel is unsubribed successfully")
            )
        }
        else{
            const sub = await Subscription.create({channel: channelId, subcriber: userID})
            return res.status(200).json(
                new ApiResponse(200,sub,"Channel is subribed successfully")
            )
        }
    } catch (error) {
        new ApiResponse(500,{},"Internal error occured ,toggleSubscription ")
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}