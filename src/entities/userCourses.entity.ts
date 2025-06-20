import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Courses } from "./courses.entity";

@Entity()
export class UserCourses {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  crs_id: number;

  @ManyToOne(() => User, (user) => user.userCourses)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Courses, (course) => course.userCourses)
  @JoinColumn({ name: "crs_id" })
  course: Courses;

  @Column({ type: "timestamp" })
  enrolled_at: Date;

  @Column()
  progress_minutes: number;

  @Column()
  completed: boolean;

  @Column({ type: "timestamp" })
  last_accessed_at: Date;
}
