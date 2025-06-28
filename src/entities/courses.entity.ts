import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm";
import { Section } from "./section.entity";
import { UserCourses } from "./userCourses.entity";
import { Comment } from "./comment.entity";
import { User } from "./user.entity";
import { CourseMaterial } from "./courseMaterial.entity";

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn()
  crs_id: number;

  @Column({ type: "varchar", length: 200 })
  crs_desc: string;

  @Column({ type: "int" })
  crs_sections: number;

  @Column({ type: "varchar", length: 100 })
  crs_author: string;

  @Column({ type: "int" })
  crs_rating: number;

  @Column({ type: "varchar", length: 200 })
  crs_img: string;

  @Column({ type: "varchar", length: 100 })
  crs_name: string;

  @Column({ type: "int" })
  enr_count: number;

  @Column({ type: "int", default: 0 })
  rating_count: number;

  @OneToMany(() => Section, (section) => section.course)
  sections: Section[];

  @OneToMany(() => UserCourses, (userCourses) => userCourses.course)
  userCourses: UserCourses[];

  @OneToMany(() => Comment, (comment) => comment.course)
  comments: Comment[];

  @OneToMany(() => User, (user) => user.course)
  users: User[];

@OneToMany(() => CourseMaterial, (courseMaterial) => courseMaterial.course)
courseMaterials: CourseMaterial[];
}
