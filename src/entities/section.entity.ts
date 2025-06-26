import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, BaseEntity } from "typeorm";
import { Course } from "./courses.entity";
import { Question } from "./question.entity";


@Entity()
export class Section extends BaseEntity {
  @PrimaryGeneratedColumn()
  section_id: number;

  @Column({ type: "varchar", length: 50 })
  section_name: string;

  @Column({ type: "varchar", length: 200 })
  section_desc: string;

  @Column({ type: "int" })
  section_duration: number;

  @ManyToOne(() => Course, (course) => course.sections)
  @JoinColumn({ name: "crs_id" })
  course: Course;

  @OneToMany(() => Question, (question) => question.section_id)
questions: Question[];


 
}
