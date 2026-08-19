import { httpRequest,HttpMethods} from "../services";

export const getAssetsData = () =>{
    return httpRequest({
        url:"/assets",
        method:HttpMethods.GET
    })
}
export const createAssetData = (assetData) => {
    return httpRequest({
      url:"/assets" ,
      method:HttpMethods.POST,
      payload:assetData
    })
}

export const updateAssetData = (assetId,assetData) => {
    return httpRequest({
     url:`/assets/${assetId}` ,
     method:HttpMethods.PUT,
     payload:assetData
    })
}