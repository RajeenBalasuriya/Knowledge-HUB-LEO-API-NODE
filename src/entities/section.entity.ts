import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Courses } from "./Courses";
import { SectionMaterial } from "./SectionMaterial";

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  section_id: number;

  @Column({ length: 50 })
  section_name: string;

  @Column({ length: 200 })
  section_desc: string;

  @Column()
  section_duration: number;

  @ManyToOne(() => Courses, (course) => course.sections)
  @JoinColumn({ name: "crs_id" })
  course: Courses;

  @OneToMany(() => SectionMaterial, (material) => material.section)
  materials: SectionMaterial[];
}
