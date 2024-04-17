import mongoose, { Types, isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    try {
        const {tweet} = req.body
        if(!tweet){
            throw new ApiError(404,"Tweet not found ~!!")
        }
        
        const userr = req.user?._id

        if(!userr){
            throw new ApiError(123,"rjraqr")
        }
        console.log(userr);
        const tweetadded = await Tweet.create({
            owner: req.user?._id,
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
        // const {UserId} = req.params

        const user = req.user?._id
        if(!User){
            throw new ApiError(404,"User  not found ~!!")
        }
        const comment = await Tweet.aggregate([
            {
              $match: {
                owner: new mongoose.Types.ObjectId(user) // Assuming owner is an ObjectId
              }
            },
            {
              $lookup: {
                from: "users", // Assuming "user" is the name of the collection
                localField: "owner",
                foreignField: "_id", // Assuming "_id" is the field in the "user" collection
                as: "name"
              }
            },
            {
              $project: {
                "name.username": 1, // Include the "username" field from the "user" subdocument
                "name.email": 1,
                content: 1 // Include the "content" field from the original document
              }
            }
            
            
          ]
          )
    
        return res.status(200)
            .json(
                new ApiResponse(200,comment,"tweet successfully shown!!")
            )
    
    } catch (error) {
        throw new ApiError(500, error?.message)
    }
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    try {
        const {tweetId} = req.params;
        const {content} = req.body;
    
        if(!tweetId){
            throw new ApiError(400,"field required for updations  tweetID")
        }
        if(!content){
            throw new ApiError(400,"field required for updations content ")
        }
        console.log(tweetId);
        console.log(content);
    
        if(!isValidObjectId(tweetId)){
            throw new ApiError(400,"Invalid tweet ID ")
        }
        const tweet = await Tweet.findByIdAndUpdate(tweetId,
            {
                $set:{
                    content: content
                }
            },{new: true});
    
        if(!tweet){
            throw new ApiError(500,"Cannt find and update tweet")
        }
    
        return res.status(200)
        .json(
            new ApiResponse(200,tweet,"Tweet updated !!")
        )    
    } catch (error) {
        throw new ApiError(500,error?.message || "some error occurded")
    }


})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    try {
        const {tweetId} = req.params
        if(!tweetId){
            throw new ApiError(400,"tweet id is requierd to deleted")
        }
        if(!isValidObjectId(tweetId)){
            throw new ApiError(400,"Invalid tweet ID ")
        }
        await Tweet.findByIdAndUpdate(tweetId);
    
        return res.status(200).json(
            new ApiResponse(200,{},"Tweet deleted successfully")
        )
    } catch (error) {
        throw new ApiError(500,error?.message || "Cannt deleted  tweet,due to some internal error. ")
    }

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}