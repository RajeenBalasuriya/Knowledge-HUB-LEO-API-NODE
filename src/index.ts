import 'reflect-metadata'
import express from 'express'
import config from './config/config';
import { errorHandler } from './middlewares/errorHandler';
import { AppDataSource } from './config/data-source';
import { User } from './entities/user.entity';
import { UserCourses } from './entities/userCourses.entity';
import userRouter from './routes/user.routes';
import authRouter from './routes/auth.routes';

const app = express();

app.use(express.json())

//create database connection with type orm 
AppDataSource.initialize();

//define routes
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)

//health check route
app.use('/health',async(req,res)=>{
    res.json("I AM DOING FINE :)")
})

// Global error handler 
app.use(errorHandler);

//intialize server
app.listen(config.port,()=>{
    console.log(`Application is listening on ${config.port}`)
})
