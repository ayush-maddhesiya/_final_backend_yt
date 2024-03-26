import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import { verifyVideo } from "./video.controller.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    try {
        const { videoId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        if (!videoId) {
            throw new ApiError(400, "Video is not found!!")
        }
    
        const comment = await Comment.find({video: videoId})
    
        if (!comment) {
            throw new ApiError(400, "Comment is not found with respective data.!!")
        }
    
        return res.status(200).json(
            new ApiResponse(200,comment,"All comment successfully fetch with current video")
        )
    } catch (error) {
        throw new ApiError(500, "Error Occuered while getting comment of respective video.")    
    }
    

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    // get a comment form body || url
    //to which video || tweet you want to comment
    //link to that
    //post the comment
    try {
        const { content} = req.body;
        const {videoId,UserId} = req.params;
        
        const video =  verifyVideo(videoId);

        if (!video) {
            throw new ApiError(500," Video cannt be fetched while adding comment."
            )
        }

        if (!content) {
            throw new ApiError(400, "Comment is Required!!")
        }


        const comment = await Comment.create({
            content: content,
            video: Video._id,
            onwer: User._id
        })

        return res.status(200).json(
            new ApiResponse(200, comment, "Comment added successfully!")
        )
    }
    catch (error) {
        throw new ApiError(500, "Error Occuered while adding Comment")
    }
}
)
const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    try {
        const { commentId } = req.params;
    
        const comment = Comment.findByIdAndUpdate(commentId);
    
    
        if (!comment) {
            throw new ApiError(404, "CommentId is required")
        }
    
        const { content } = req.body;
    
        if (!content) {
            throw new ApiError(404, "Error Occuered while content is required")
        }
    
        comment.content = content;
    
        const updatedComment = await comment.save();
    
        return res.status(200).json(
            new ApiResponse(200, updateComment, "Comment is updated successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Comment is updated")
    }


})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    try {
        const {commentId} =  req.params;
        const comment = Comment.findByIdAndUpdate(commentId);
        if(!comment){
            throw new ApiError(500,"Unable to fetech comment you want to delete")
        }
        
        await Comment.findByIdAndDelete(
            Comment._id
        );
    
        return res.status(201)
        .json(
            new ApiResponse(201,{},"Comment deleted Successfully")
        )
    } catch (error) {
        throw new ApiError(500,"Error occured while deleting comment")
    }
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}