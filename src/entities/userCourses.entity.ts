import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn,BaseEntity } from "typeorm";
import { User } from "./user.entity";
import { Course } from "./courses.entity";

@Entity()
export class UserCourses extends BaseEntity{
  @PrimaryColumn({ type: "int" })
  user_id: number;

  @PrimaryColumn({ type: "int" })
  crs_id: number;

  @ManyToOne(() => User, (user) => user.userCourses)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Course, (course) => course.userCourses)
  @JoinColumn({ name: "crs_id" })
  course: Course;

  @Column({ type: "timestamp" })
  enrolled_at: Date;

  @Column({ type: "int" })
  progress_minutes: number;

  @Column({ type: "boolean" })
  completed: boolean;

  @Column({ type: "timestamp" })
  last_accessed_at: Date;
}
