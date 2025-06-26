import 'reflect-metadata'
import express from 'express'
import http from "http";
import config from './config/config';
import { errorHandler } from './middlewares/errorHandler';
import { AppDataSource } from './config/data-source';


import userRouter from './routes/user.routes';
import authRouter from './routes/auth.routes';
import courseRouter from './routes/course.routes';
import courseMaterialRouter from './routes/courseMaterial.routes';
import commentRouter from './routes/comment.routes';
import sectionRouter from './routes/section.routes';
import questionRouter from './routes/question.router';
import answerRouter from './routes/answer.rotues';

import { initSocket } from './web-socket /socket';
import { registerNotificationListeners } from './web-socket /listeners/notification.listener';

const app = express();
const server = http.createServer(app); // Wrap Express with HTTP server

app.use(express.json())

//create database connection with type orm 
AppDataSource.initialize();

//define routes
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/course',courseRouter)
app.use('/api/course-material',courseMaterialRouter)
app.use('/api/comment',commentRouter)
app.use('/api/section',sectionRouter)
app.use('/api/question',questionRouter)
app.use('/api/answer',answerRouter) 

//health check route
app.use('/health',async(req,res)=>{
    res.json("I AM DOING FINE :)")
})

// Global error handler 
app.use(errorHandler);
// Initialize socket.io
initSocket(server);
registerNotificationListeners();



server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
