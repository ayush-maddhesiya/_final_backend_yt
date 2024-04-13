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
    
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if(!videoId){
        throw new ApiError(404,"Please provide a valid video Id")
    }

    const getComment  = await Comment.aggregate([
        {
            $match:{
                video:new mongoose.Types.ObjectId(videoId)
            },
        },
        {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owners",
            },
          },
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "comment",
              as: "likes",
            },
          },
          {
            $addFields: {
              likesCount: {
                $size: "$likes",
              },
              owner: {
                // $arrayEleAt: ["$owners", 0],
                //   alternative
                  $first:"$owners",
              },
              isLiked: {
                $cond: {
                  if: {
                    $in: [req.user?._id, "$likes.likedBy"],
                  },
                  then: true,
                  else: false,
                },
              },
            },
          },
]);



})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    // get a comment form body || url
    //to which video || tweet you want to comment
    //link to that
    //post the comment
    try {
        const { videoId } = req.params;
        const { content } = req.body;
        
        const video = verifyVideo(videoId);

        if (!video) {
            throw new ApiError(500, " Video cannt be fetched while adding comment."
            )
        }

        if (!content) {
            throw new ApiError(400, "Comment is Required!!")
        }


        const comment = await Comment.create({
            content,
            video: videoId,
            onwer: req.user?._id
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

        if (!commentId) {
            throw new ApiError(404, "CommentId is required")
        }

        const { content } = req.body;

        if (!content) {
            throw new ApiError(404, "content is required in body")
        }

        if (!isValidObjectId(commentId)) {
            throw new ApiError(400, "Invalid Video ID");
        }

        const getComment = await Comment.findById(commentId);

        if (req.user?._id.toString() !== getComment?.owner.toString()) {
            throw new ApiError(400, "User is not the owner of this comment");
        }

        const uploadComment = Comment.findByIdAndUpdate(commentId,
            {
                $set: {
                    content: content
                }
            }
            , { new: true });


        if (!uploadComment) {
            throw new ApiError(404, "Error Occuered while content is required")
        }


        return res.status(200).json(
            new ApiResponse(200, uploadComment, "Comment is updated successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Comment is updated")
    }


})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    try {
        const { commentId } = req.params;
        if (!commentId) {
            throw new ApiError(404, "CommentId is required for deletion")
        }
        if (isValidObjectId(commentId)) {
            throw new ApiError(400, "Invalid COmmenrt ID")
        }
        const getComment = await Comment.findById(commentId);

        if (!getComment) {
            throw new ApiError(404, "COmment not found")
        }

        if (getComment?.owner.toString() !== req.user?._id.toString()) {
            throw new ApiError(400, "User is not the owner of this comment");
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(201)
            .json(
                new ApiResponse(201, {}, "Comment deleted Successfully")
            )
    } catch (error) {
        throw new ApiError(500, "Error occured while deleting comment")
    }
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}