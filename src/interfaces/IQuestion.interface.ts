export interface IQuestion {
    question_id?: number;
    question: string;
    question_solution: string;
    image_url?: string;
    section: number; // ID of the related section
}