export interface IAnswer {
    answerId?: number; // Optional ID for the answer, can be used for updates
    content: string; 
    isCorrect: boolean; 
    questionId: number; 

}