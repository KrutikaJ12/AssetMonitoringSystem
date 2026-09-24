import { httpRequest,HttpMethods } from "../services";

export const login=(data)=>{
  return httpRequest({
    url:"/auth/login",
    method:HttpMethods.POST,
    payload:data
  })
}
export const logout = () => {
  return httpRequest({
    url: "/auth/logout",
    method: HttpMethods.POST,
  });
};