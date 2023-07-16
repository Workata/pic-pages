import React from 'react';
import {
  Box,
  Typography,
  Button
} from "@mui/material";
import { Link } from "react-router-dom";


export default function Home() {

  return (
    <>
      <Box>
        <Link to={`/album/${process.env.REACT_APP_ROOT_FOLDER_ID}`}>Album</Link>
      </Box>
    </>
  );
}
