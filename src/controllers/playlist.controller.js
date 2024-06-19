import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { verifyVideo } from "./video.controller.js"

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
    
        if(!isValidObjectId(videoID)){
             throw new ApiError(404,"Vidoe is required to processed")
         }
        
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
        throw new ApiError(500,error.message  || "there is problem while create a new playlists!!")
    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    try {
        const {userId} = req.params
        //TODO: get user playlists
        const playlist = await Playlist.aggregate(
            [
                {
                  '$match': {
                    'onwer': new mongoose.Types.ObjectId(userId)
                  }
                }, {
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'onwer', 
                    'foreignField': '_id', 
                    'as': 'onwerName'
                  }
                }, {
                  '$addFields': {
                    'numberOfSongs': {
                      '$size': '$videos'
                    }
                  }
                }, {
                  '$project': {
                    'onwerName.fullName': 1, 
                    'onwerName.username': 1, 
                    'name': 1, 
                    'discription': 1, 
                    'numberOfSongs': 1
                  }
                }
              ]
        )
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
     if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"this is not valid Playlist ID")
    }
     //TODO: get playlist by id
     const playlist = await Playlist.findById(playlistId)
     if (!playlist) {
         throw new ApiError(404,"Not playlist found!!!!!!!")
     }
     
    //  console.log(playlist);
     return res.status(200).json(
         new ApiResponse(200,playlist,"Playlist fetched succesfully !")
     )
   } catch (error) {
    throw new ApiError(500,   error?.message || " Playlist not fetched succesfully  Id !")
   }

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    let playlistName
    try {
        const {playlistId, videoId} = req.params;
        const playlist = await Playlist.findByIdAndUpdate(playlistId,
            {
                $push:{
                    videos: videoId
                }
            },
            {
                new: true
            }
        )
        playlistName  = await Playlist.aggregate([
            {
              '$match': {
                '_id': new mongoose.Types.ObjectId(playlistId)
              }
            }, {
              '$lookup': {
                'from': 'users', 
                'localField': 'onwer', 
                'foreignField': '_id', 
                'as': 'OwnedBy'
              }
            }, {
              '$project': {
                'name': 1, 
                'discription': 1, 
                'OwnedBy.fullName': 1
              }
            }
          ])
        console.log(playlistName);
        console.log(playlist);
        
        return res.status(200).json(
            new ApiResponse(200,playlistName,"Video added to playlist ")
        )
    } catch (error) {
        throw new ApiError(500,error?.message || "No Video added to playlist ")
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId, videoId} = req.params
        // TODO: remove video from playlist
        const playlist = await Playlist.findByIdAndUpdate(playlistId,

            {
                $pull: {
                    videos: videoId
                }
            },
            {
                'new': true
            }

        )
    
        return res.status(200).json(
            new ApiResponse(200,playlist,"Remove video to playlist ")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || " NNoooooooooo Remove video to playlist ")
    }
})

const deletePlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId} = req.params
        // TODO: delete playlist
        if(!isValidObjectId(playlistId)){
            throw new ApiError(400,"this is not valid Playlist ID")
        }
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
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"this is not valid Playlist ID")
    }
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