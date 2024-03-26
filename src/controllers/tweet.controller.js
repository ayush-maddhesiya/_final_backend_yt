import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {tweet,onwer} = req.body
    if(!tweet){
        throw new ApiError(404,"Tweet not found ~!!")
    }

    const tweetadded = await Tweet.create({
        onwer: owner,
        content: tweet
    })

    return res.status(200)
    .json(
        new ApiResponse(200,tweetadded,"Tweet added!!")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}