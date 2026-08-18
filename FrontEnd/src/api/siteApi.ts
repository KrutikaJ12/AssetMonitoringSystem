import { HttpMethods,httpRequest } from "../services";

export const getsitesData = () => {
    return httpRequest({
     url:"/sites" ,
     method:HttpMethods.GET
    })
}

export const createSiteData = (siteData) => {
    return httpRequest({
     url:"/sites" ,
     method:HttpMethods.POST,
     payload:siteData
    })
}
export const updateSiteData = (siteId,siteData) => {
    return httpRequest({
     url:`/sites/${siteId}` ,
     method:HttpMethods.PUT,
     payload:siteData
    })
}