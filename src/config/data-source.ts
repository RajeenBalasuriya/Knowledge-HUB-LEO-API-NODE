import { DataSource } from "typeorm";
import config from "./config"; // import your shared config
import { User } from "../entities/user.entity";
import { Section } from "../entities/section.entity";
import { SectionMaterial } from "../entities/sectionMaterial.entity";
import { Courses } from "../entities/courses.entity";
import { UserCourses } from "../entities/userCourses.entity";
import { Comment } from "../entities/comment.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.db.host,
  port: 3306,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  entities: [User, Section, SectionMaterial,Comment,Courses,UserCourses],
  synchronize: false,
  logging: false,
});
