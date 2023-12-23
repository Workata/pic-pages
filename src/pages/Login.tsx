// ? ref to old login
// ? https://github.com/Workata/photo-album/blob/main/frontend/src/pages/Login.js

import { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";

// * Material UI
import {
  Box,
  Button,
  TextField
} from '@mui/material';

import { useLogin } from "hooks/api/auth/useLogin";
import { AppContext } from 'AppContext';

  
export default function Login () {
  const navigate = useNavigate();
  const { setTokenCookie, setTokenValue } = useContext(AppContext)
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {login, errorMsg} = useLogin();

  const handleLoginButton = async () => {
    if(username === "" || password === "") return;
    let res = await login(username, password);
    if(res.status === 200) {
      setTokenValue(res.data.access_token);
      setTokenCookie("token", res.data.access_token);
      navigate("/");    // redirect to the homepage after successful login
    }
  }

  return (
    <Box
      sx={{
        width: '400px',
        height: '315px',
        borderColor: 'white',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '15%',
      }}
    >
      <TextField
        sx={{
          color: 'black',
          backgroundColor: 'white',
          marginBottom: '30px',
          marginTop: '38px',
        }}
        className="inputRounded"
        color="primary"
        variant="filled"
        label="Username"
        placeholder="Enter username"
        type="username"
        fullWidth
        onChange={(event) => setUsername(event.target.value)}
      />

      <TextField
        sx={{
          color: 'black',
          backgroundColor: 'white',
          marginBottom: '15px'
        }}
        color="primary"
        label="Password"
        variant="filled"
        placeholder="Enter password"
        type="password"
        fullWidth
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      {/* Error message */}
      <Box
        sx={{
          color: 'red',
          lineHeight: '30px',
          fontWeight: 'bold',
          width: '400px',
          height: '30px',
          marginBottom: '30px',
          textAlign: 'center'
        }}
      >
        {errorMsg}
      </Box>

      <Button
        type="submit"
        size="large"
        variant="contained"
        onClick={handleLoginButton}
        sx={{
          display: 'block',
          margin: '0 auto',
          width: '150px'
        }}
      >
        Sign in
      </Button>
    </Box>
  )
}