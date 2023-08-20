import axios from 'axios';


export const getMarkers = async (callback: any, errorcallback: any) => {
  axios.get("/api/map/marker").then( res => {
    if(callback != null){
      callback(res);
    }
  }
  ).catch( err => {
    if(errorcallback != null){
      errorcallback(err);
   }
  })
}

export const createMarker = async (body: any, callback: any, errorcallback: any) => {
  axios.post(`/api/map/marker`, body).then( res => {
    if(callback != null){
      callback(res);
    }
  }
  ).catch( err => {
    if(errorcallback != null){
      errorcallback(err);
   }
  })
}
