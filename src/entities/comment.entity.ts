import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { User } from "./user.entity";
import { Course } from "./courses.entity";

@Entity()
export class Comment extends BaseEntity{
  @PrimaryGeneratedColumn()
  comment_id: number;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Course, (course) => course.comments)
  @JoinColumn({ name: "crs_id" })
  course: Course;

  @Column({ type: "varchar", length: 100 })  // Explicit type for string
  content: string;

  @Column({ type: "timestamp" })  // Already explicit
  timestamp: Date;
}
