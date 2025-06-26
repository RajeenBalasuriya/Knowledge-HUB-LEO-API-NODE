import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { Question } from "./question.entity";

@Entity()
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn()
  answer_id: number;

  @Column({ type: "varchar", length: 200 })
  content: string;

  @Column({ type: "boolean", default: false })
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn({ name: "question_id" })
  question: Question;
}
