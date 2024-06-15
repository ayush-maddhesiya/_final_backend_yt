import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userID = req.user._id;
    // console.log(user);
    // console.log("you r here");

    try {
        const totalVideo = await Video.countDocuments({"onwer":"userID"})
        const totalSubcriber = await Subscription.countDocuments({"channel":"userID"})
        const totallikes = await Likes.countDocuments({"likedBy":"userID"})
        // const totalVideo = await Video.countDocuments({"onwer":"userID"})
    
        res.status(200).json(
            new ApiResponse(200,totalSubcriber + totalVideo + totallikes,"you get the data you want")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || " internal error in dashboard ")
    }



})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStats, 
    getChannelVideos
    }