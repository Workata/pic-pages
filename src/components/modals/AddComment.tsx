import {useState, useEffect} from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useCreateImageData } from "hooks/api/images/useCreateImageData";
import { useGetImageData } from "hooks/api/images/useGetImageData";
import { useUpdateImageComment } from "hooks/api/images/useUpdateImageComment";


export default function AddCommentModal(props: any) {
  const [commentFormInput, setCommentFormInput] = useState<string>('');
  const {getImageData, imageData} = useGetImageData();     // undefined by default, null if resources not found on backend side
  const {updateImageComment} = useUpdateImageComment();
  const {createImageData} = useCreateImageData();

  const handleCloseButton = () => {
    props.setOpenDialogWindow(false);
    setCommentFormInput('');
  };

  const handleSaveButton = () => {
    updateImageComment(props.imgId, commentFormInput);
    props.setOpenDialogWindow(false);
  }

  useEffect(() => {
    if(props.openDialogWindow === true && props.imgId) {
      getImageData(props.imgId);
    }
  }, [props.openDialogWindow, props.imgId]);

  useEffect(() => {
    // * if image data was set for null (non existing on backend site) we have to create one and fetch image data again
    if(imageData === null) {
      createImageData(props.imgId, props.name);
      getImageData(props.imgId);
    }
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
          <Button onClick={handleCloseButton}>Close</Button>
          <Button onClick={handleSaveButton}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
