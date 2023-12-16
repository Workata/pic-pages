import axios from 'axios';





export const createCategory = async (body: any, callback: any, errorcallback: any) => {
  axios.post("/api/v1/categories", body).then( res => {
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
