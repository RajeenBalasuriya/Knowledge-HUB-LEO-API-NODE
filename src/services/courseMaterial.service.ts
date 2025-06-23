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

  //delete course material
    async deleteCourseMaterial(crs_m_id: number) {
    try {
      const courseMaterial = await CourseMaterial.findOneBy({ crs_m_id });

      if (!courseMaterial) {
        return null;
      }

      await courseMaterial.remove();
      return courseMaterial;
    } catch (err) {
      const error = new Error("Failed to delete course material");
      (error as any).status = 500;
      (error as any).code = "COURSE_MATERIAL_DELETION_FAILED";
      (error as any).details = err;
      throw error;
    }}

    //read course material by id
  async getCourseMaterialById(crs_m_id: number) {
    try {
      const courseMaterial = await CourseMaterial.findOneBy({ crs_m_id });

      if (!courseMaterial) {
        return null;
      }

      return courseMaterial;
    } catch (err) {
      const error = new Error("Failed to retrieve course material");
      (error as any).status = 500;
      (error as any).code = "COURSE_MATERIAL_RETRIEVAL_FAILED";
      (error as any).details = err;
      throw error;
    }
  }
}
