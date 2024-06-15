import mongoose,{isValidObjectId} from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import { verifyVideo } from "./video.controller.js"



const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoID} = req.params
    const { page = 1, limit = 10 } = req.query;

    await verifyVideo(req,res);
    
    let getComment;
    try {
        getComment  = await Comment.aggregate([
            {
                $match:{
                    video:new mongoose.Types.ObjectId(videoID)
                },
            },
            {
                $lookup: {
                  from: "users",
                  localField: "onwer",
                  foreignField: "_id",
                  as: "ownerdetails",
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
              {
                $project:{
                    _id:1,
                    content:1,
                    "ownerdetails.fullName" : 1,
                    isLiked: 1
                }
              }
    ]);

    console.log(getComment)
    } catch (error) {
        throw new ApiError(400,"error while getting the details")
    }

return res.status(200).json(
    new ApiResponse(200, getComment, "Comment fetched successfully!")
)

})

    const addComment = asyncHandler(async (req, res) => {
        // TODO: add a comment to a video
        // get a comment form body || url
        //to which video || tweet you want to comment
        //link to that
        //post the comment
        try {

            const { videoID } = req.params;
            // console.log(videoID);
            const { content } = req.body;
            // console.log(content);
        
            const video = await verifyVideo(req,res);
            // console.log(video,"video from vertiy video")

            if (!content) {
                throw new ApiError(400, "Comment is Required!!")
            }


            const comment = await Comment.create({
                content,
                video: videoID,
                onwer: req.user?._id
            })

            return res.status(200).json(
                new ApiResponse(200, comment, "Comment added successfully!")
            )

        }
        catch (error) {
            throw new ApiError(500, error?.message)
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

        const {content} = req.body;

        if (!content) {
            throw new ApiError(404, "content is required in body")
        }

        if (!isValidObjectId(commentId)) {
            throw new ApiError(400, "Invalid Video ID");
        }

        const getComment = await Comment.findById(commentId);

        if (req.user?._id.toString() !== getComment?.onwer.toString()) {
            throw new ApiError(400, "User is not the owner of this comment");
        }
        // content.toString();
        const uploadComment = await Comment.findByIdAndUpdate(commentId,
            {
                $set:{
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
        throw new ApiError(500, error?.message || "Comment is not  updated")
    }


})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    try {
        const { commentId } = req.params;
        if (!commentId) {
            throw new ApiError(404, "CommentId is required for deletion")
        }
        //console.log(commentId,isValidObjectId(commentId));
        if (!isValidObjectId(commentId)) {
            throw new ApiError(400, "Invalid COmmenrt ID")
        }
        const getComment = await Comment.findById(commentId);
        console.log(getComment.onwer);
        if (!getComment) {
            throw new ApiError(404, "COmment not found")
        }
        // if (!req.user || !req.user._id) {
        //     throw new ApiError(400, "User information not available");
        // }   
        console.log(getComment?.owner)

        if (getComment?.onwer.toString() !== req.user?._id.toString()) {
            throw new ApiError(400, "User is not the owner of this comment");
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(201)
            .json(
                new ApiResponse(201, {}, "Comment deleted Successfully")
            )
    } catch (error) {
        throw new ApiError(500, error?.message || "Error occured while deleting comment")
    }
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
}