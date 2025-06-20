import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Section } from "./section.entity";
import { UserCourses } from "./userCourses.entity";
import { Comment } from "./comment.entity";
import { User } from "./user.entity";

@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
  crs_id: number;

  @Column({ length: 200 })
  crs_desc: string;

  @Column()
  crs_sections: number;

  @Column({ length: 100 })
  crs_author: string;

  @Column()
  crs_rating: number;

  @Column({ length: 200 })
  crs_img: string;

  @Column({ length: 100 })
  crs_name: string;

  @Column()
  enr_count: number;

  @OneToMany(() => Section, (section) => section.course)
  sections: Section[];

  @OneToMany(() => UserCourses, (userCourses) => userCourses.course)
  userCourses: UserCourses[];

  @OneToMany(() => Comment, (comment) => comment.course)
  comments: Comment[];

  @OneToMany(() => User, (user) => user.course)
  users: User[];
}
