import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudniray.js"

//allis working fine only patch in not work updatebyID

const verifyVideo = asyncHandler(async (req, res,next) => {
    console.log("okay  1");
    const {videoID} = req.params
    console.log("verify video id okay??",videoID);
    const video = await Video.findById(videoID)
    if (!video) {
        throw new ApiError(500, "Vidoe is not found in database..")
    }
    console.log("okay");

    return video;
})


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})
//this is done and working fine........
const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    //console.log(req.files.thumbnail[0]?.path);

    try {
        const videoPath = req.files?.videoFile[0]?.path;
        let videoThumbnail;
if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0 && req.files.thumbnail[0].path) {
    videoThumbnail = req.files.thumbnail[0].path;
}

        const videoThumnail = req.files?.thumbnail[0]?.path;
        // console.log(req.files.thumbnail[0]?.path);
         console.log(videoPath, videoThumnail);
        if (!videoPath) {
            throw new ApiError(404, "Video path is required!!")
        }
        if (!videoThumnail) {
            throw new ApiError(404, "Video thumb nail  path is required!!")
        }

        const video = await uploadOnCloudinary(videoPath);
        const thumb = await uploadOnCloudinary(videoThumnail);
        console.log(thumb);
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

//this is working fine
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

//this not working , Error: thumbnail path is required to updated
const updateVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const newthumbnail = req.files?.thumbnail[0]?.path ;
    //console.log(thumbnail);
    //TODO: update video details like title, description, thumbnail
    try {
        if (!videoId) {
            throw new ApiError(404, "videoId is required")
        }
        // console.log(videoId);
        if (!isValidObjectId(videoId)) {
            throw new ApiError(404, "videoId is not valid plzz cheak")
        }
        const { title, description } = req.body;

        if (!title ) {
            throw new ApiError(404, "title && description is required")
        }

        if (!description ) {
            throw new ApiError(404, "title && description is required")
        }
         //console.log(req.files?.thumbnail[0]?.path ," ", req.files?.thumbnail[0]);
        //const newthumbnail = req.files?.thumbnail[0]?.path ;
        if (!newthumbnail) {
            throw new ApiError(404, "thumbnail path is required to updated")
        }

        const tty = await uploadOnCloudinary(newthumbnail);
       // console.log(newthumbnail.url);
        //verification is required i guess ,soo that only user can update only this video only 
        const userId = req.user.id; // Assuming you have user information in the request object

        // Check if the video belongs to the user
        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found");
        }
        if (video.owner.toString() !== userId.toString()) {
            throw new ApiError(403, "You are not authorized to update this video");
        }

        const updateVideos = await Video.findByIdAndUpdate(videoId,
            {
                $set: {
                    title: title,
                    description: description,
                    thumbnail: tty.url
                }
            }
            , { new: true })

        return res.status(200).json(
            new ApiResponse(201,updateVideos,"scusedully")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "error while updating some video")
    }
})

//this is working fine
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
        const userId = req.user._id; // Assuming you have user information in the request object
    
        // Check if the video belongs to the user
        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found");
        }
        // console.log(video.owner);
        // console.log(userId);
        if (video.owner?.toString() !== userId.toString()) {
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

//this is fine , working
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.findById(videoId)
    const togglePublish = await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                isPublished: !video.isPublished
            }
        },
        { new: true }
    )
    
    if (!togglePublish) {
        throw new ApiError(400, " do not toggled on this , successfully");
    }

    
    return res.status(200).json(
        new ApiResponse(200,togglePublish, "video IS TOGGLED ")
    )

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