import axios from 'axios';


export const getFolderContent = async (folder_id: any, callback: any, errorcallback: any) => {
  axios.get(`/api/folder/${folder_id}`).then( res => {
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
