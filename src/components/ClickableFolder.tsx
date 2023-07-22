import React, {useState, useEffect, useContext} from "react";
import {
  Box,
  Typography,
  Button
} from "@mui/material";
import { Link } from "react-router-dom";


import { ImageList, ImageListItem } from '@mui/material';
import { Folder } from "@mui/icons-material";
import FolderIcon from '@mui/icons-material/Folder';


export default function ClickableFolder(props: any) {

  return (
    <>
      <Button
        variant="contained"
        component={Link}
        to={`/album/${props.id}`}
      >
        <FolderIcon sx={{marginRight: '15px'}}/>  {props.name} 
      </Button>
    </>
  );
}
