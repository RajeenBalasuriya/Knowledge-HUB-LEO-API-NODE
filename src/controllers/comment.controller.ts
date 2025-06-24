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

//update comment
export const updateComment = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const user: IJwtUser = req.user;
  const commentId = parseInt(req.params.id);
  const commentData: string = req.body.content;

  try {
    const updatedComment = await commentService.updateComment({
      userId: user.id,
      commentId,
      content: commentData
    });

    res.status(200).json({
      status: "success",
      message: "Comment updated successfully",
      data: {
        updatedComment,
        meta: null,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
    try{

        const user: IJwtUser = req.user;
        const commentId = parseInt(req.params.id);

        const deletedComment = await commentService.deleteComment({
            userId: user.id,
            commentId
        });

        if (!deletedComment) {
            res.status(404).json({
                status: "error",
                message: "Comment not found or you do not have permission to delete it",
                error: {
                    code: "COMMENT_NOT_FOUND",
                    details: `No comment found with id ${commentId}`,
                },
            });
            return;
        }

        res.status(200).json({
            status: "success",
            message: "Comment deleted successfully",
            data: {
                deletedComment,
                meta: null,
            },
        });

    }catch(err){
        next(err);
    }
}
