import React, {useState, useEffect, useContext} from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Category } from "../../models/Category";
import { ImageData } from "../../models/ImageData";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { postImageData, patchImageComment } from "../../services/images";
import { fetchImageData } from "../../clients/fetchImageData";


export default function AddCommentModal(props: any) {
  // undefined by default, null if resources not found on backend side
  const [imageData, setImageData] = useState<ImageData | null | undefined>(undefined);
  const [commentFormInput, setCommentFormInput] = useState<string>('');

  const handleCloseDialogWindow = () => {
    props.setOpenDialogWindow(false);
    setCommentFormInput('');
  };

  const updateComment = () => {
    patchImageComment(props.imgId, {'comment': commentFormInput},
    (res: any) => {console.log(res)}, (err: any) => {console.log(err)});
  }


  useEffect(() => {
    if(props.openDialogWindow === true && props.imgId) {
      fetchImageData(props.imgId, setImageData);
    }
  }, [props.openDialogWindow, props.imgId]);

  useEffect(() => {
    // * if image data was set for null (non existing on backend site) we have to create one and fetch image data again
    if(imageData === null) {
      postImageData({"id": props.imgId, "name": props.imgName, "categories": []}, () => {}, () => {})
      fetchImageData(props.imgId, setImageData);
    }
    // if(imageData && imageData.comment !== comment) setComment(imageData.comment);
    if(imageData !== null && imageData !== undefined && imageData.comment !== '') setCommentFormInput(imageData.comment);
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
        <DialogTitle>Add comment</DialogTitle>
        <DialogContent sx={{width: '400px'}}>
          <TextField
            margin="dense"
            id="name"
            label="Comment"
            type="text"
            fullWidth
            variant="standard"
            value={commentFormInput}
            onChange={(event) => setCommentFormInput(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogWindow}>Close</Button>
          <Button onClick={updateComment}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
