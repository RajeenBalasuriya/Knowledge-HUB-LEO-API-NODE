import { Question } from "../entities/question.entity";
import { IQuestion } from "../interfaces/IQuestion.interface";

export class QuestionService {

    async createQuestion(questionData: IQuestion){
        try {
            const newQuestion = Question.create(questionData);
            return await newQuestion.save();
        } catch (err) {
            const error = new Error("Failed to create question");
            (error as any).status = 500;
            (error as any).code = "QUESTION_CREATION_FAILED";
            (error as any).details = err;
            throw error;
        }
    }

}