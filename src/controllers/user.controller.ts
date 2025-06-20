import { Request,Response,NextFunction } from "express";
import { User } from "../entities/user.entity";

 interface IUser {
  
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: number;
  role: string;
  profile_img?: string | null; // nullable
}


export const createUser=async(req:Request<{},{},IUser>,res:Response,next:NextFunction)=>{
    const {first_name} = req.body
    res.json(`got this body :${first_name}` )
}