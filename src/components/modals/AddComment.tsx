import {useState, useEffect} from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { postImageData, patchImageComment } from "../../services/images";

import { useGetImageData } from "../../hooks/useGetImageData";


export default function AddCommentModal(props: any) {
  const [commentFormInput, setCommentFormInput] = useState<string>('');
  const {getImageData, imageData} = useGetImageData();     // undefined by default, null if resources not found on backend side

  const handleCloseButton = () => {
    props.setOpenDialogWindow(false);
    setCommentFormInput('');
  };

  const handleSaveButton = () => {
    patchImageComment(props.imgId, {'comment': commentFormInput},
    (res: any) => {console.log(res)}, (err: any) => {console.log(err)});
  }


  useEffect(() => {
    if(props.openDialogWindow === true && props.imgId) {
      getImageData(props.imgId);
    }
  }, [props.openDialogWindow, props.imgId]);

  useEffect(() => {
    // * if image data was set for null (non existing on backend site) we have to create one and fetch image data again
    if(imageData === null) {
      postImageData({"id": props.imgId, "name": props.imgName, "categories": []}, () => {}, () => {})
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
