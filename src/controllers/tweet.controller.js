import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    try {
        const {tweet,onwer} = req.body
        if(!tweet){
            throw new ApiError(404,"Tweet not found ~!!")
        }
    
        const tweetadded = await Tweet.create({
            onwer: User._id,
            content: tweet
        })
    
        return res.status(200)
        .json(
            new ApiResponse(200,tweetadded,"Tweet added!!")
        )
    } catch (error) {
        throw new ApiError(500,"Cannt create  tweet,due to some internal error. ")
    }
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    try {
        const {UserId} = req.params
        if(!User){
            throw new ApiError(404,"User  not found ~!!")
        }
        const comment = await Tweet.find({owner: UserId})
    
        return res.status(200)
            .json(
                new ApiResponse(200,comment,"tweet successfully shown!!")
            )
    
    } catch (error) {
        throw new ApiError(500,"Error occured while getting user Tweets")
    }
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    try {
        const {tweetId} = req.params;
        const {content} = req.body;
    
        if(!(tweetId && content)){
            throw new ApiError(400,"field required for updations")
        }
    
        const tweet = await Tweet.findByIdAndUpdate(tweetId,content,{new: ture});
    
        if(!tweet){
            throw new ApiError(500,"Cannt find and update tweet")
        }
    
        return res.status(200)
        .json(
            new ApiResponse(200,tweet,"Tweet updated !!")
        )    
    } catch (error) {
        throw new ApiError(500,"Cannt update tweet,due to some internal error. ")
    }


})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    try {
        const {tweetID} = req.params
        if(!tweetID){
            throw new ApiError(400,"tweet id is requierd to deleted")
        }
        await Tweet.findByIdAndUpdate(tweetID);
    
        return res.status(200).json(
            new ApiResponse(200,{},"Tweet deleted successfully")
        )
    } catch (error) {
        throw new ApiError(500,"Cannt deleted  tweet,due to some internal error. ")
    }

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}