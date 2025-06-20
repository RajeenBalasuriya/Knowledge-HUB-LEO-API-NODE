import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Section } from "./section.entity";

@Entity()
export class SectionMaterial {
  @PrimaryGeneratedColumn()
  material_id: number;

  @Column({ type: "varchar", length: 200 })
  vid_link: string;

  @Column({ type: "varchar", length: 200 })
  pdf_link: string;

  @ManyToOne(() => Section, (section) => section.materials)
  @JoinColumn({ name: "section_id" })
  section: Section;
}
