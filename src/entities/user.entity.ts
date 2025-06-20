import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { UserCourses } from "./userCourses.entity";
import { Comment } from "./comment.entity";
import { Courses } from "./courses.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ length: 50 })
  first_name: string;

  @Column({ length: 50 })
  last_name: string;

  @Column({ length: 50 })
  email: string;

  @Column()
  mobile_no: number;

  @Column({ length: 20 })
  role: string;

  @Column({ length: 100, nullable: true })
  profile_img: string;

  @ManyToOne(() => Courses, (course) => course.users, { nullable: true })
  @JoinColumn({ name: "crs_id" })
  course: Courses;

  @OneToMany(() => UserCourses, (userCourses) => userCourses.user)
  userCourses: UserCourses[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
