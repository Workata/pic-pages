import React, {useState, useEffect, useContext} from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Category } from "../../models/Category";
import { ImageData } from "../../models/ImageData";

import { fetchCategories } from "../../clients/fetchCategories";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { getImageData, postImageData } from "../../services/images";
import { fetchImageData } from "../../clients/fetchImageData";


export default function SelectCategoryModal(props: any) {
  const [categories, setCategories] = useState<Category[]>();
  const [imageData, setImageData] = useState<ImageData | null | undefined>(undefined);

  const handleCloseDialogWindow = () => {
    props.setOpenDialogWindow(false);
    setImageData(undefined);
    // setCategories([]);
  };


  useEffect(() => {
    if(props.openDialogWindow === true && props.imgId) {
      fetchImageData(props.imgId, setImageData);
      fetchCategories(setCategories);
    }
  }, [props.openDialogWindow, props.imgId]);

  useEffect(() => {
    if(imageData === null) {
      postImageData({"id": props.imgId, "categories": []}, () => {}, () => {})
      fetchImageData(props.imgId, setImageData);
    }
    // if(imageData instanceof ImageData)
    console.log("Image data")
    console.log(imageData);
  }, [imageData]);

  return (
    <>
      <Dialog
        open={props.openDialogWindow}
        onClose={props.handleCloseDialogWindow}
        sx={{
          zIndex: 999999994   // image viewer has 999999993
        }}
      >
        <DialogTitle>Select Category {imageData?.id}</DialogTitle>
        <DialogContent sx={{width: '400px'}}>
          {/* <Checkbox defaultChecked /> */}
        <FormGroup>
          {imageData && categories && categories.map(
           (category) => <FormControlLabel 
            control={imageData?.categories.find(e => e.name === category.name)? <Checkbox defaultChecked/> : <Checkbox/>} 
            label={category.name} 
            key={category.name}
           />
          )}
        </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogWindow}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
