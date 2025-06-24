import { Section } from "../entities/section.entity";
import { ISection } from "../interfaces/ISection.interface";

export class SectionService {
    //create section
    async createSection(section: ISection){
        try{
        const { section_name, section_desc, section_duration, crs_id } = section;

        

        const newSection = Section.create({
            section_name,
            section_desc,
            section_duration,
            course: { crs_id }
        });

        return await newSection.save();

        }catch (err) 
        {
            const error = new Error("Failed to create section");
            (error as any).status = 500;
            (error as any).code = "SECTION_CREATION_FAILED";
            (error as any).details = err;
            throw error;
        }
        
    }
}