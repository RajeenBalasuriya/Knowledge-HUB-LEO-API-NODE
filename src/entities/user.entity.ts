import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn,BaseEntity } from "typeorm";
import { UserCourses } from "./userCourses.entity";
import { Comment } from "./comment.entity";
import { Course } from "./courses.entity";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: "varchar", length: 50 })
  first_name: string;

  @Column({ type: "varchar", length: 50 })
  last_name: string;

  @Column({ type: "varchar", length: 50 })
  email: string;

  @Column({ type: "varchar", length: 100})
  password: string;

  @Column({ type: "bigint" }) // or "varchar" if you want to store as string
  mobile_no: number;

  @Column({ type: "varchar", length: 20 })
  role: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  profile_img: string;

  @ManyToOne(() => Course, (course) => course.users, { nullable: true })
  @JoinColumn({ name: "crs_id" })
  course: Course;

  @OneToMany(() => UserCourses, (userCourses) => userCourses.user)
  userCourses: UserCourses[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
