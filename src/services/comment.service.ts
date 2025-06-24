// services/comment.service.ts
import { Comment } from '../entities/comment.entity';
export class CommentService {
  async createComment({ userId, courseId, content }) {
  const comment = Comment.create({
    user: { user_id: userId },          // reference by ID only
    course: { crs_id: courseId },       // reference by ID only
    content,
    timestamp: new Date(),
  });

  const commentCreated= await comment.save();
  return commentCreated;
};
}