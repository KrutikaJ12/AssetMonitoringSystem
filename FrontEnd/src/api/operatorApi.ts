import { httpRequest,HttpMethods } from "../services";

export const getoperatorsData = () => {
    return httpRequest({
        url:"/operators",
        method:HttpMethods.GET
    })
}

export const createOperatorData = (operatorData) => {
    return httpRequest({
      url:"/operators" ,
      method:HttpMethods.POST,
      payload:operatorData 
    })
}

export const updateOperatorData = (operatorId,operatorData) => {
    return httpRequest({
      url:`/operators/${operatorId}`,
      method:HttpMethods.PUT,
      payload:operatorData 
    })
}