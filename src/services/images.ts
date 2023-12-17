import axios from 'axios';


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

export const patchImageComment = async (img_id: number, data: any, callback: any, errorcallback: any): Promise<any> => {
  axios.patch(`/api/v1/images/${img_id}/comment`, data=data
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

export const getCategoryContent = async (categoryName: string, callback: any, errorcallback: any) => {
  axios.get(`/api/v1/images/category/${categoryName}`).then( res => {
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
