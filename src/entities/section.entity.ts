import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Courses } from "./courses.entity";
import { SectionMaterial } from "./sectionMaterial.entity";

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  section_id: number;

  @Column({ type: "varchar", length: 50 })
  section_name: string;

  @Column({ type: "varchar", length: 200 })
  section_desc: string;

  @Column({ type: "int" })
  section_duration: number;

  @ManyToOne(() => Courses, (course) => course.sections)
  @JoinColumn({ name: "crs_id" })
  course: Courses;

  @OneToMany(() => SectionMaterial, (material) => material.section)
  materials: SectionMaterial[];
}
