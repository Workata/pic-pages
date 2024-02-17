import { useState, useEffect, useContext } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useGetOrCreateImageData } from "hooks/api/images/useGetOrCreateImageData";
import { useUpdateImageComment } from "hooks/api/images/useUpdateImageComment";

import { AppContext } from "AppContext";

export default function AddCommentModal(props: any) {
  const [commentFormInput, setCommentFormInput] = useState<string>("");
  const { updateImageComment } = useUpdateImageComment();
  const { getOrCreateImageData, imageData } = useGetOrCreateImageData();
  const { tokenValue } = useContext(AppContext);

  const modalIsClosed =
    document.getElementsByClassName("MuiDialog-root").length === 0;

  const descriptionHtml = document.getElementsByClassName("description")[0];

  const handleCloseButton = () => {
    props.setOpenDialogWindow(false);
  };

  const handleSaveButton = () => {
    updateImageComment(props.imgId, commentFormInput, tokenValue);    // handle update on backend site

    // ! UPDATE IMAGE DESCRIPTION ON FRONTEND WITHOUT REFRESHING WHOLE PAGE
    // * update comment inside viewer
    props.viewer.updateComment(props.imgId, commentFormInput);

    // * update images state - for re-rendering imageViewer
    let imgIdx = props.images.findIndex((e: any) => e.id === props.imgId);
    props.images[imgIdx].comment = commentFormInput;
    props.setImages(props.images);

    // * update currently visible html element (image description) -- it has to be the last one
    descriptionHtml.innerHTML = descriptionHtml.innerHTML.replace(new RegExp(" - .*"), ` - ${commentFormInput}`);

    props.setOpenDialogWindow(false);
  };

  useEffect(() => {
    if (props.openDialogWindow === true && props.imgId) {
      getOrCreateImageData(props.imgId, props.imgName, [], "", tokenValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.openDialogWindow, props.imgId]);

  useEffect(() => {
    if (modalIsClosed === true) {
      setCommentFormInput("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsClosed]);

  useEffect(() => {
    if (imageData) {
      setCommentFormInput(imageData.comment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData]);

  return (
    <>
      <Dialog
        open={props.openDialogWindow}
        onClose={props.handleCloseDialogWindow}
        sx={{
          zIndex: 999999994, // image viewer has 999999993
        }}
      >
        <DialogTitle>Add comment</DialogTitle>
        <DialogContent sx={{ width: "400px" }}>
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
