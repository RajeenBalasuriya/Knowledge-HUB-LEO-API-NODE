import { IJwtUser } from "../interfaces/IUserJwt.interface";

export const checkRole =(user:IJwtUser)=>{

    if(user.role!='admin'){

       return{
        status: "error",
        message: "You Need Admin Role To Perform This Action",
        error: {
          code: "Not Allowed Action",
          details: null,
        }}
    }
    return;
       
}