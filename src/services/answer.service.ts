import { Answer } from "../entities/answer.entity";
import { IAnswer } from "../interfaces/IAnswer.interface";

export class AnswerService {
  async createAnswers(answers: IAnswer[]) {
    try {
      const createdAnswers = [];

      for (const answer of answers) {
        const { contetnt, isCorrect, questionId } = answer;

        const newAnswer = {
          content: contetnt,
          is_correct: isCorrect,
          question: { question_id: questionId },
        };

        const createdAnswer = Answer.create(newAnswer);
        await createdAnswer.save();
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
