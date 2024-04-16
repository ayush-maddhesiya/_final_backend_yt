import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudniray.js"

const verifyVideo = asyncHandler(async (req, res) => {
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(500, "Vidoe is not found in database..")
    }
})


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video

    try {
        const videoPath = req.files.videoFile[0]?.path;
        const videoThumnail = req.files.thumbnail[0]?.path;

        //  console.log(videoPath, videoThumnail);
        if (!videoPath) {
            throw new ApiError(404, "Video path is required!!")
        }
        if (!videoThumnail) {
            throw new ApiError(404, "Video thumb nail  path is required!!")
        }

        const video = await uploadOnCloudinary(videoPath);
        const thumb = await uploadOnCloudinary(videoThumnail);

        // console.log(video,thumb);
        const videos = await Video.create({
            videoFile: video.url,
            thumbnail: thumb.url,
            title:title,
            description: description,
            duration: 0,
            views: 0,
            isPublished: true,
            owner: req.user?._id
        })
        //  console.log(videos);
        const createdVideo = await Video.findById(videos._id);
        if (!createdVideo) {
            throw new ApiError(499, "error while uploading new video to db")
        }

        return res.status(200).json(
            new ApiResponse(200, createdVideo, "video uploaded successfully to DB and cloudniary")
        )
    } catch (error) {
        throw new ApiError(500, error?.message )
    }

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    try {
        if (!videoId) {
            throw new ApiError(404, "videoId is required")
        }
        if (!isValidObjectId(videoId)) {
            throw new ApiError(404, "videoId is not valid plzz cheak")
        }

        const video = await Video.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(videoId)
                }
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
                $project: {
                    title:1,
                    description:1,
                    thumbnail:1,
                    videoFile:1,
                    "owners.fullName": 1,
                    "owners.username": 1
                }
            }
        ])

        return res.status(200).json(
            new ApiResponse(200, video, "video info fetched succefully")
        )
    } catch (error) {
        throw new ApiError(500, "cannot getvideo !1")
    }

})

const updateVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    try {
        if (!videoId) {
            throw new ApiError(404, "videoId is required")
        }
        if (!isValidObjectId(videoId)) {
            throw new ApiError(404, "videoId is not valid plzz cheak")
        }
        const { title, description } = req.body();

        if (!(title && description)) {
            throw new ApiError(404, "title && description is required")
        }

        const thumbnail = req.files?.thumbnail[0].path
        if (!thumbnail) {
            throw new ApiError(404, "thumbnail path is required to updated")
        }

        //verification is required i guess ,soo that only user can update only this video only 
        const userId = req.user.id; // Assuming you have user information in the request object

        // Check if the video belongs to the user
        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found");
        }
        if (video.userId.toString() !== userId) {
            throw new ApiError(403, "You are not authorized to update this video");
        }

        const updateVideos = Video.findByIdAndUpdate(videoId,
            {
                $set: {
                    title: title,
                    description: description,
                    thumbnail: thumbnail
                }
            }
            , { new: true })
    } catch (error) {
        throw new ApiError(500, error?.message || "error while updating some video")
    }
})

const deleteVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    try {
        if (!videoId) {
            throw new ApiError(404, "videoId is required")
        }
        if (!isValidObjectId(videoId)) {
            throw new ApiError(404, "videoId is not valid plzz cheak")
        }
    
        //verification is required i guess ,soo that only user can update only this video only 
        const userId = req.user.id; // Assuming you have user information in the request object
    
        // Check if the video belongs to the user
        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found");
        }
        if (video.userId.toString() !== userId) {
            throw new ApiError(403, "You are not authorized to update this video");
        }
    
    
        await Video.findByIdAndDelete(videoId)
    
        return res.status(200).json(
            new ApiResponse(200, {}, "videoDeleted sccussfully")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "error while deleting video by its ID")
    }

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    
})

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideoById,
    deleteVideoById,
    togglePublishStatus,
    verifyVideo
}