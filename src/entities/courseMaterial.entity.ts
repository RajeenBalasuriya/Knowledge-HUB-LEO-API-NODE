import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { Courses } from "./courses.entity";

@Entity()
export class CoursesMaterial extends BaseEntity {
  @PrimaryGeneratedColumn()
  crs_m_id: number;

  @Column({ type: "varchar", length: 20 })
  material_type: string;

  @Column({ type: "varchar", length: 200 })
  source_url: string;

  @ManyToOne(() => Courses, (course) => course.courseMaterials)
  @JoinColumn({ name: "crs_id" })
  course: Courses;
}
