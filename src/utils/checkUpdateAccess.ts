import { IJwtUser } from "../interfaces/IUserJwt.interface";

export const checkUpdateAccess =(userFromToken:IJwtUser,userIdFromParams:string)=>{
if(userFromToken.role!='admin'){
    
       if(userFromToken.id!=userIdFromParams){
       
       return{
        status: "error",
        message: "Not Allowed Action",
        error: {
          code: "Not Allowed Action",
          details: null,
        },
      }
}
}
return;
}