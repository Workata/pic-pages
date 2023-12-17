import axios from 'axios';
import { useState } from 'react';


export const useLogin = () => {
  const [response, setResponse] = useState<any>();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(true);

  const login = async (username: string, password: string) => {
    let data = {
      username: username,
      password: password
    }
    let headers = {"Content-Type": "application/x-www-form-urlencoded"}
    axios.post(
      "/api/v1/auth/login", data, {headers: headers}
    ).then( res => {
      setResponse(res);
      setErrorMsg('');
    }).catch( err => {
      setErrorMsg(err.response.data.detail);
    }).finally( () => {
      setLoading(false);
    });
  }

  return {
    login,
    response,
    errorMsg,
    loading
  }
}
