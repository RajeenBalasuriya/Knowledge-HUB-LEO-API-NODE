import { Answer } from "../entities/answer.entity";
import { IAnswer } from "../interfaces/IAnswer.interface";
import { Question } from "../entities/question.entity";

export class AnswerService {
  async createAnswers(answers: IAnswer[]) {
    try {
      const createdAnswers = [];

      for (const answer of answers) {
        const { content, isCorrect, questionId } = answer;

        const newAnswer = Answer.create({
          content,
          isCorrect,
          question: Question.create({ question_id: questionId }),
        });

        await newAnswer.save();
        createdAnswers.push(newAnswer);
      }

      return createdAnswers;
    } catch (err) {
      const error = new Error("Failed to create answers");
      (error as any).status = 500;
      (error as any).code = "ANSWER_CREATION_FAILED";
      (error as any).details = err;
      throw error;
    }
  }
}
