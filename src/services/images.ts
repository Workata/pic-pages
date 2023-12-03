import axios from 'axios';


export const getImageData = async (img_id: any, callback: any, errorcallback: any): Promise<any> => {
  axios.get(`/api/v1/images/${img_id}`).then( res => {
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


export const patchImageCategories = async (img_id: any, data: Array<string>, callback: any, errorcallback: any): Promise<any> => {
  axios.patch(`/api/v1/images/${img_id}/categories`, data=data).then( res => {
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


export const postImageData = async (data: any, callback: any, errorcallback: any): Promise<any> => {
  axios.post('/api/v1/images', data=data
  ).then( res => {
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
