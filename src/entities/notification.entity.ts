import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity, Index } from "typeorm";
import { User } from "./user.entity";

@Entity()
@Index(["user_id", "created_at"]) // Index for efficient user-specific queries
@Index(["created_at"]) // Index for cleanup operations
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  notification_id: number;

  @Column({ type: "int" })
  user_id: number;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", length: 100 })
  type: string; // 'comment', 'course_update', 'enrollment', etc.

  @Column({ type: "varchar", length: 200 })
  title: string;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "json", nullable: true })
  data: any; // Additional data like course_id, comment_id, etc.

  @Column({ type: "boolean", default: false })
  is_read: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  read_at: Date;
} 