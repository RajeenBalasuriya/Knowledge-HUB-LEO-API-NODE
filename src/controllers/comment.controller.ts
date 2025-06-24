import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/IAuthRequest.interface";
import { IComment } from "../interfaces/IComment.interface";
import { IJwtUser } from "../interfaces/IUserJwt.interface";
import { CommentService } from "../services/comment.service";

const commentService = new CommentService();
//create comment
export const createComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
    const user: IJwtUser = req.user;
    const commentData: IComment = req.body;

    try {
       

        console.log("Creating comment with data:", commentData);


        const createdComment = await commentService.createComment({userId: user.id, courseId: commentData.crs_id, content: commentData.content});
        

        res.status(201).json({
            status: "success",
            message: "Comment created successfully",
            data: {
                createdComment,
                meta: null,
            },
        });
    } catch (err) {
        next(err);
    }

};
