import mongoose, {isValidObjectId} from "mongoose"
import {Likes} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId = req.user?._id

    
    //console.log(req.user._id);
    if (!videoId) {
        throw new ApiError(400,"videoId is not found ")
    }
    if (!userId) {
        throw new ApiError(400,"UserId is not found ")
    }

   try {
     const existsLike = await Likes.findOne({video: videoId,likedBy:userId});
     if(existsLike){
         await Likes.findOneAndDelete({video: videoId,likedBy:userId});
         return res.status(200).json(new ApiResponse(200,existsLike,"Like remove from video"))
     }
     else{
         await Likes.create({video: videoId,likedBy:userId});
         return res.status(200).json(new ApiResponse(200,existsLike,"Like added to video"))
     }
 
 
   } catch (error) {
        return res.status(500).json(new ApiResponse(200,{},"Some errror occured while toggling like on video"))
   }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user._id
    try {
        const existsLike = await Likes.findOne({comment: commentId,likedBy:userId});
        if(existsLike){
            await Likes.findOneAndDelete({comment:commentId,likedBy:userId});
            return res.status(200).json(new ApiResponse(200,existsLike,"Like remove from comment"))
        }
        else{
            await Likes.create({comment: commentId,likedBy:userId});
            return res.status(200).json(new ApiResponse(200,existsLike,"Like added to comment"))
        }
    
    
      } catch (error) {
           return res.status(500).json(new ApiResponse(200,{},"Some errror occured while toggling like on comment"))
      }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user._id
    try {
        const existsLike = await Likes.findOne({tweet: tweetId ,likedBy:userId});
        if(existsLike){
            await Likes.findOneAndDelete({tweet: tweetId ,likedBy:userId});
            return res.status(200).json(new ApiResponse(200,existsLike,"Like remove from tweet"))
        }
        else{
            await Likes.create({tweet: tweetId ,likedBy:userId});
            return res.status(200).json(new ApiResponse(200,existsLike,"Like added to tweet"))
        }
    
    
      } catch (error) {
           return res.status(500).json(
            new ApiResponse(200,{},"Some errror occured while toggling like on tweet")
           )
      }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    try {
        //TODO: get all liked videos
        const { videoId } = req.params;
        const allLikes = await Likes.find({ video: videoId });
        const likeCount = allLikes.length;

        return res.status(200).json( 
            new ApiResponse(200,likeCount, "All likes fetched successfully")
         );
    } catch (error) {
        console.error("Error fetching liked videos:", error);
        return res.status(500).json(
            new ApiResponse(200,{},"Internal server error,getLikedVideos ")
        );
    }
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}