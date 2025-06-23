import { DataSource } from "typeorm";
import config from "./config"; // import your shared config
import { User } from "../entities/user.entity";
import { Section } from "../entities/section.entity";
import { Course } from "../entities/courses.entity";
import { UserCourses } from "../entities/userCourses.entity";
import { Comment } from "../entities/comment.entity";
import { CourseMaterial } from "../entities/courseMaterial.entity";
import { Question } from "../entities/question.entity";
import { Answer } from "../entities/answer.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.db.host,
  port: 3306,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  entities: [User, Section,Comment,Course,UserCourses,CourseMaterial,Question,Answer],
  synchronize: true,
  logging: false,
});
