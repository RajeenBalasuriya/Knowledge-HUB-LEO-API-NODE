import 'reflect-metadata'
import express from 'express'
import config from './config/config';
import { errorHandler } from './middlewares/errorHandler';
import { AppDataSource } from './config/data-source';

const app = express();

app.use(express.json())

//create database connection with type orm 
AppDataSource.initialize();

//define routes


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
