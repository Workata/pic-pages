// ? ref to old login
// ? https://github.com/Workata/photo-album/blob/main/frontend/src/pages/Login.js

import { useState } from 'react';


// * Material UI
import {
  Box,
  Button,
  TextField
} from '@mui/material';

import { useLogin } from "../hooks/useLogin";
  
  
export default function Login () {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {login, response, errorMsg, loading} = useLogin();

  const handleLoginButton = async () => {
    if(username === '' || password === '') return;
    login(username, password);
  }

  return (
    <Box
      sx={{
        // backgroundImage: `url(${backgroundImage})`,
        // borderRadius: '5%',
        // borderStyle: 'solid',
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
        onChange={(event) => {
          setUsername(event.target.value)
        }}
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
          setPassword(event.target.value)
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