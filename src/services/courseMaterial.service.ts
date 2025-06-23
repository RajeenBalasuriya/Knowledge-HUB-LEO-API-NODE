import { ICourseMaterial } from "../interfaces/ICourseMaterial.interface";
import { CourseMaterial } from "../entities/courseMaterial.entity";
export class CourseMaterialService {
  async createCourseMaterial(courseMaterial: ICourseMaterial) {
    const { material_type, source_url, crs_id } = courseMaterial;

    try {
      const courceMaterial = CourseMaterial.create({
        material_type,
        source_url,
        course: { crs_id },
      });

      const createdCourseMaterial = await courceMaterial.save();
      return createdCourseMaterial;
    } catch (err) {
      const error = new Error("Failed to create course material");
      (error as any).status = 500;
      (error as any).code = "COURSE_MATERIAL_CREATION_FAILED";
      (error as any).details = err;
      throw error;
    }
  }
}
