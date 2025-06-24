import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/IAuthRequest.interface";
import { QuestionService } from "../services/question.service";

const questionService=new QuestionService();

export const createQuestion = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
    
    try {
        const questionData = req.body;
    
        // Assuming you have a service to handle question creation
        const createdQuestion = await questionService.createQuestion(questionData);
    
        res.status(201).json({
        status: "success",
        message: "Question created successfully",
        data: {
            question: createdQuestion,
            meta: null,
        },
        });
    } catch (err) {
        next(err);
    }
}