import axios from 'axios';


export const getFolderContent = async (folder_id: number, callback: any, errorcallback: any) => {
  axios.get(`/api/v1/gdrive/folder/${folder_id}`).then( res => {
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
