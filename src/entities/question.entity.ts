import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, BaseEntity } from "typeorm";
import { Section } from "./section.entity";
import { Answer } from "./answer.entity";

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  question_id: number;

  @Column({ type: "varchar", length: 200 })
  question: string;

  @Column({ type: "varchar", length: 200 })
  question_solution: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  image_url: string;

  @ManyToOne(() => Section, (section) => section.questions)
  @JoinColumn({ name: "section_id" })
  section: Section;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
