import { Section } from "../entities/section.entity";
import { ISection } from "../interfaces/ISection.interface";

export class SectionService {
    //create section
    async createSection(section: ISection){
        try{
        const { sec_name, sec_desc, sec_duration, video_url, crs_id } = section;

        

        const newSection = Section.create({
            section_name:sec_name,
            section_desc:sec_desc,
            section_duration:sec_duration,
            video_url: video_url,
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

    async updateSection(sectionId: number, updateData: any) {
        try {
            const section = await Section.findOne({ where: { section_id: sectionId } });
            if (!section) {
                const error = new Error("Section not found");
                (error as any).status = 404;
                (error as any).code = "SECTION_NOT_FOUND";
                throw error;
            }

            // Map DTO fields to entity fields
            if (updateData.sec_name !== undefined) section.section_name = updateData.sec_name;
            if (updateData.sec_desc !== undefined) section.section_desc = updateData.sec_desc;
            if (updateData.sec_duration !== undefined) section.section_duration = updateData.sec_duration;
            if (updateData.video_url !== undefined) section.video_url = updateData.video_url;
            if (updateData.completed !== undefined) section.completed = updateData.completed;

            await section.save();
            return section;
        } catch (err) {
            const error = new Error("Failed to update section");
            (error as any).status = 500;
            (error as any).code = "SECTION_UPDATE_FAILED";
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