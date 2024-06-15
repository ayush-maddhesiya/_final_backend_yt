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
        const userID = req.user._id
        const ifSub  = await Subscription.findOne({channel: channelId, subcriber: userID})
        if(ifSub){
            const sub = await Subscription.findOneAndDelete({channel: channelId, subcriber: userID})
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
    try {
        if(!channelId  && isValidObjectId(channelId)){
            throw new ApiError(404,"Channel id is required")
        }
        const channelLists = await Subscription.find({"channel":"channelId"})
        // console.log(channelId);
    
        if(!channelLists){
            throw new ApiError(502,"no able to find any subcriber or not single one exist thier")
        }
    
        res.status(200).json(
            new ApiResponse(200,channelLists,"you got list of all subss")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "thier is an error of getting of this list internal")
    }
    
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    try {
        if(!subscriberId  && isValidObjectId(subscriberId)){
            throw new ApiError(404,"Channel id is required")
        }
        const userLists = await Subscription.find({"subcriber":"subscriberId"})
        // console.log(channelId);
    
        if(!subscriberId){
            throw new ApiError(502,"no able to find any subcriber or not single one exist thier")
        }
    
        res.status(200).json(
            new ApiResponse(200,userLists,"you got list of all subss")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "thier is an error of getting of this list internal")
    }
    

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}