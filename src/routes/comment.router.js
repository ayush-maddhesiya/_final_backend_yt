import { Router } from "express";

import {
    addComment,
    getVideoComments,
    updateComment,
    deleteComment,
} from "../controllers/comment.controller.js"

import {veriftyJWT} from "../middlewares/auth.middleware.js"
const router = Router();
router.use(veriftyJWT);

router.route("/:videoID").get(getVideoComments).post(addComment);
router.route("/:commentId").delete(deleteComment).patch(updateComment);

export default router