import axios from 'axios';
import { useState } from 'react';


export const useLogin = () => {
  const [errorMsg, setErrorMsg] = useState<string>('');

  const login = (username: string, password: string): any => {
    let data = {
      username: username,
      password: password
    }
    let headers = {"Content-Type": "application/x-www-form-urlencoded"}

    return axios.post(
      "/api/v1/auth/login", data, {headers: headers}
    ).then( res => {    // 200
      setErrorMsg('');
      return res;
    }).catch( err => {    // 401
      let res = err.response;
      setErrorMsg(res.data.detail);
      return res;
    });
  }

  return {
    login,
    errorMsg
  }
}
