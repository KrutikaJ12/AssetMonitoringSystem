import { HttpMethods,httpRequest } from "../services";

export const getusersData = () => {
    return httpRequest({
     url:"/users" ,
     method:HttpMethods.GET
    })
}

export const createUserData = (userData) => {
    return httpRequest({
     url:"/users" ,
     method:HttpMethods.POST,
     payload:userData
    })
}
export const updateUserData = (userId,userData) => {
    return httpRequest({
     url:`/users/${userId}` ,
     method:HttpMethods.PUT,
     payload:userData
    })
}