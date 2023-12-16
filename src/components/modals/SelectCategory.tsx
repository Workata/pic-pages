import React, {useState, useEffect, useContext} from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { Category } from "../../models/Category";
import { ImageData } from "../../models/ImageData";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { getImageData, postImageData, patchImageCategories } from "../../services/images";
import { fetchImageData } from "../../clients/fetchImageData";

import {useGetCategories} from "../../hooks/useGetCategories";


export default function SelectCategoryModal(props: any) {
  const [imageData, setImageData] = useState<ImageData | null | undefined>(undefined);
  const {getCategories, categories, errorMsg, loading} = useGetCategories();

  const handleCloseDialogWindow = () => {
    props.setOpenDialogWindow(false);
    setImageData(undefined);
  };

  const updateCategories = (categoryName: string) => {
    console.log("Update category")
    let updatedImageData = imageData;
    let updatedCategories = imageData!.categories.map((category) => category.name);
    if (updatedCategories?.includes(categoryName)) {
      // * uncheck category
      const index = updatedCategories.indexOf(categoryName);
      updatedCategories.splice(index, 1); // 2nd parameter means remove one item only
      updatedImageData!.categories = imageData!.categories.filter((category) => category.name !== categoryName);
      setImageData(updatedImageData);
    } else {
      // * check category
      updatedCategories.push(categoryName);
      updatedImageData!.categories = imageData!.categories.concat([new Category({'name': categoryName})]);
      setImageData(updatedImageData);
    }
    patchImageCategories(props.imgId, updatedCategories,
      (res: any) => {console.log(res)}, (err: any) => {console.log(err)}
    )
    // fetchImageData(props.imgId, setImageData);
  }


  useEffect(() => {
    if(props.openDialogWindow === true && props.imgId) {
      fetchImageData(props.imgId, setImageData);
      getCategories();
    }
  }, [props.openDialogWindow, props.imgId]);

  useEffect(() => {
    // * if image data was set for null (non existing on backend site) we have to create one
    if(imageData === null) {
      postImageData({"id": props.imgId, "name": props.imgName, "categories": []}, () => {}, () => {})
      fetchImageData(props.imgId, setImageData);
    }
  }, [imageData]);

  return (
    <>
      <Dialog
        open={props.openDialogWindow}
        onClose={props.handleCloseDialogWindow}
        sx={{
          zIndex: 999999994   // ! image viewer has 999999993
        }}
      >
        <DialogTitle>Select Category</DialogTitle>
        <DialogContent sx={{width: '400px'}}>
          {/* <Checkbox defaultChecked /> */}
        <FormGroup>
          {imageData && categories && categories.map(
           (category) => <FormControlLabel 
            control={imageData?.categories.find(e => e.name === category.name)? <Checkbox defaultChecked/> : <Checkbox/>} 
            label={category.name} 
            key={category.name}
            onChange={() => updateCategories(category.name)}
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
