import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/IAuthRequest.interface";
import { AnswerService } from "../services/answer.service";

const answerService = new AnswerService();
export const createAnswer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
    try {
       
        const answerData = req.body;
        
        const answerCreated = await answerService.createAnswers(answerData);

        res.status(201).json({
            status: "success",
            message: "Answer created successfully",
            data: {
               answerCreated,
                meta: null,
            },
        });
    
    } catch (err) {
        next(err);
    }
    
}