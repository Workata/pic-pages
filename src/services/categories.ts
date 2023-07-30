import axios from 'axios';


export const getCategories = async (callback: any, errorcallback: any) => {
  axios.get(`/api/categories`).then( res => {
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
