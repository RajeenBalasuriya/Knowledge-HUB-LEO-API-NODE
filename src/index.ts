import 'reflect-metadata'
import express from 'express'
import http from "http";
import cors from 'cors';
import config from './config/config';
import { errorHandler } from './middlewares/errorHandler';
import { AppDataSource } from './config/data-source';
import { CronScheduler } from './utils/cronScheduler';

import userRouter from './routes/user.routes';
import authRouter from './routes/auth.routes';
import courseRouter from './routes/course.routes';
import courseMaterialRouter from './routes/courseMaterial.routes';
import commentRouter from './routes/comment.routes';
import sectionRouter from './routes/section.routes';
import questionRouter from './routes/question.router';
import answerRouter from './routes/answer.rotues';
import userCoursesRouter from './routes/userCourses.routes';
import notificationRouter from './routes/notification.routes';
import cronRouter from './routes/cron.routes';

import { initSocket } from './web-socket /socket';
import { registerNotificationListeners } from './web-socket /listeners/notification.listener';

const app = express();
const server = http.createServer(app); // Wrap Express with HTTP server

app.use(express.json())
app.use(cors());
//create database connection with type orm 
AppDataSource.initialize();

// Initialize cron scheduler
const cronScheduler = CronScheduler.getInstance();
cronScheduler.initialize();

//define routes
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/course',courseRouter)
app.use('/api/course-material',courseMaterialRouter)
app.use('/api/comment',commentRouter)
app.use('/api/section',sectionRouter)
app.use('/api/question',questionRouter)
app.use('/api/answer',answerRouter) 
app.use('/api/user-courses',userCoursesRouter)
app.use('/api/notifications',notificationRouter)
app.use('/api/cron',cronRouter)

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

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  cronScheduler.stop();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  cronScheduler.stop();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
