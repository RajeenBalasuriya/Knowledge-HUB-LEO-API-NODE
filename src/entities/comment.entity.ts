import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Courses } from "./courses.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  comment_id: number;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Courses, (course) => course.comments)
  @JoinColumn({ name: "crs_id" })
  course: Courses;

  @Column({ length: 100 })
  content: string;

  @Column({ type: "timestamp" })
  timestamp: Date;
}
