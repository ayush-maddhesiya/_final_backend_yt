import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    try {
        const {name, description,videoID} = req.body
        
        //TODO: create playlist
        if(!name){
            throw new ApiError(400,"Name is required for creating a playlists")
        }
    
        if(!description){
            throw new ApiError(400,"description is required for creating a playlists")
        }
    
        // if(!isValidObjectId(videoID)){
        //     throw new ApiError(404,"Vidoe is required to processed")
        // }
        const playlist = await Playlist.create({
            name: name,
            discription: description,
            onwer: req.user?._id,
            videos: videoID
        })
    
        return res.status(200).json(
            new ApiResponse(200,playlist,"Playlist created ")
        )
    } catch (error) {
        throw new ApiError(500,error.message)
    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    try {
        const {userId} = req.params
        //TODO: get user playlists
        const playlist = await Playlist.find({onwer: userId})
        if (!playlist) {
            throw new ApiError(404,"Not playlist found!!!!!!!")
        }
    
        return res.status(200).json(
            new ApiResponse(200,playlist,"Playlist fetched succesfully !")
        )
    } catch (error) {
        throw new ApiError(500," Playlist not fetched succesfully user !")
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
   try {
     const {playlistId} = req.params
     //TODO: get playlist by id
     const playlist = await Playlist.findbyId(playlistId)
     if (!playlist) {
         throw new ApiError(404,"Not playlist found!!!!!!!")
     }
 
     return res.status(200).json(
         new ApiResponse(200,playlist,"Playlist fetched succesfully !")
     )
   } catch (error) {
    throw new ApiError(500," Playlist not fetched succesfully  Id !")
   }

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId, videoId} = req.params;
        const playlist = await Playlist.findByIdAndUpdate(playlistId,
            {
                $set:{
                    video: videoId
                }
            },{
                new: true
            }
        )
    
        return res.status(200).json(
            new ApiResponse(200,playlist,"Video added to playlist ")
        )
    } catch (error) {
        throw new ApiError(500,"No Video added to playlist ")
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId, videoId} = req.params
        // TODO: remove video from playlist
        const playlist = await Playlist.findByIdAndUpdate(playlistId,
            {
                $unset:{
                    video: 1
                }
            },{
                new: true
            }
        )
    
        return res.status(200).json(
            new ApiResponse(200,playlist,"Remove video to playlist ")
        )
    } catch (error) {
        throw new ApiError(500," NNoooooooooo Remove video to playlist ")
    }
})

const deletePlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId} = req.params
        // TODO: delete playlist
    
        const play = await Playlist.findByIdAndDelete(playlistId);
    
        return res.status(200).json(
            new ApiResponse(200,playlist,"Delete playlist by Id ")
        )
    } catch (error) {
        throw new ApiError(500," Noo Delete playlist by Id ")
    }

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    try {
        const playlist = await Playlist.findByIdAndUpdate(playlistId,{
            $set:{
                name: name,
                discription: description
            }
        },
            {
                new: true
            }
        )
    
        return res.status(200).json(
            new ApiResponse(200,playlist,"Playlist updated yeahh!!")
        )
    } catch (error) {
        throw new ApiError(500,"NNNoooo   Playlist updated yeahh!!")
    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}