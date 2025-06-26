// services/comment.service.ts

import { Comment } from "../entities/comment.entity";
import { eventEmitter } from "../web-socket /events/eventEmitter";
import { CourseService } from "./course.service";
import { UserService } from "./user.service";

const userService = new UserService();
const courseService = new CourseService();

export class CommentService {
  async createComment({ userId, courseId, content }) {
    const comment = Comment.create({
      user: { user_id: userId }, // reference by ID only
      course: { crs_id: courseId }, // reference by ID only
      content,
      timestamp: new Date(),
    });

    const commentCreated = await comment.save();

    // Fetch user and course details for the comment
    const user = await userService.getUserById(userId);
    const course = await courseService.getCourseById(courseId);

    const enrichedComment = {
      ...commentCreated,
      user:{user_name:user.first_name, user_img:user.profile_img},
      course: {
        crs_name: course.crs_name,
        crs_img: course.crs_img,
      },
    };

    // Trigger event
    eventEmitter.emit("commentCreated", enrichedComment);
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
