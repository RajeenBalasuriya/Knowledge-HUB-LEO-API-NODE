import { Section } from "../entities/section.entity";
import { ISection } from "../interfaces/ISection.interface";

export class SectionService {
    //create section
    async createSection(section: ISection){
        try{
        const { sec_name, sec_desc, sec_duration, crs_id } = section;

        

        const newSection = Section.create({
            section_name:sec_name,
            section_desc:sec_desc,
            section_duration:sec_duration,
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

    async updateSectionCompleted(sectionId: number, completed: boolean) {
        const section = await Section.findOne({ where: { section_id: sectionId } });
        if (!section) {
            const error = new Error("Section not found");
            (error as any).status = 404;
            (error as any).code = "SECTION_NOT_FOUND";
            throw error;
        }
        section.completed = completed;
        await section.save();
        return section;
    }
}