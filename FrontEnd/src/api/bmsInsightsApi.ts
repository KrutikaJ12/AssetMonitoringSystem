import { HttpMethods, httpRequest } from "../services";

export const getBmsData = (assetId)=>{
   return httpRequest({
    url:`/bms/${assetId}`,
    method :HttpMethods.GET,
})
}