// services/comment.service.ts
import { deleteComment } from "../controllers/comment.controller";
import { Comment } from "../entities/comment.entity";
export class CommentService {
  async createComment({ userId, courseId, content }) {
    const comment = Comment.create({
      user: { user_id: userId }, // reference by ID only
      course: { crs_id: courseId }, // reference by ID only
      content,
      timestamp: new Date(),
    });

    const commentCreated = await comment.save();
    return commentCreated;
  }

  async updateComment({ userId, commentId, content }) {
    const comment = await Comment.findOneBy({
      comment_id: commentId,
      user: { user_id: userId },
    });

    if (!comment) {
      const error = new Error(
        "Comment not found or you do not have permission to update it"
      );
      (error as any).status = 404;
      (error as any).code = "COMMENT_NOT_FOUND";
      throw error;
    }
    comment.content = content;
    const updatedComment = await comment.save();
    return updatedComment;
  }

  async deleteComment({ userId, commentId }) {
    try {
      const comment = await Comment.findOneBy({
        comment_id: commentId,
        user: { user_id: userId },
      });

      if (!comment) {
        const error = new Error(
          "Comment not found or you do not have permission to delete it"
        );
        (error as any).status = 404;
        (error as any).code = "COMMENT_NOT_FOUND";
        throw error;
      }

      await comment.remove();
      return comment;
    } catch (err) {
      const error = new Error("Failed to delete comment");
      (error as any).status = 500;
      (error as any).code = "COMMENT_DELETION_FAILED";
      (error as any).details = err;
      throw error;
    }
  }
}
