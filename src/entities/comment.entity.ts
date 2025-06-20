import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { User } from "./user.entity";
import { Courses } from "./courses.entity";

@Entity()
export class Comment extends BaseEntity{
  @PrimaryGeneratedColumn()
  comment_id: number;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Courses, (course) => course.comments)
  @JoinColumn({ name: "crs_id" })
  course: Courses;

  @Column({ type: "varchar", length: 100 })  // Explicit type for string
  content: string;

  @Column({ type: "timestamp" })  // Already explicit
  timestamp: Date;
}
