import React, { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { createMarker } from "../../services/imgMap";


export default function SelectCategoryModal(props: any) {
  const [longitude, setLongitude] = useState(props.coords?.longitude);
  const [latitude, setLatitude] = useState(props.coords?.latitude);
  const [url, setUrl] = useState('');

  const handleCloseDialogWindow = () => {
    props.setOpenDialogWindow(false);
  };

  const createNewMarker = () => {
    let lat = latitude;
    let lon = longitude;
    if (lat === undefined) lat = props.coords?.latitude;
    if (lon === undefined) lon = props.coords?.longitude;

    createMarker({
      "latitude": Number(lat),
      "longitude": Number(lon),
      "url": url
    }, (res: any) => {
      handleCloseDialogWindow();

      // props.fetchMarkers();
      // setOpenSuccessMsg(true);
    }, (err: any) => {
      console.log(err);
    });

  };


  return (
    <>
      <Dialog open={props.openDialogWindow} onClose={props.handleCloseDialogWindow}>
        <DialogTitle>Select Category</DialogTitle>
        <DialogContent sx={{width: '400px'}}>
        <TextField
            margin="dense"
            id="name"
            label="Longitude"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={props.coords?.longitude}
            onChange={(event) => setLongitude(event.target.value)}
          />
        <TextField
            margin="dense"
            id="name"
            label="Latitude"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={props.coords?.latitude}
            onChange={(event) => setLatitude(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Image URL"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => setUrl(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogWindow}>Cancel</Button>
          <Button onClick={createNewMarker}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
