export interface IAnswer {
    answerId?: number; // Optional ID for the answer, can be used for updates
    contetnt: string; 
    isCorrect: boolean; 
    questionId: number; 

}