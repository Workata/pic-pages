import { AppContext } from "AppContext";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useCreateMarker } from "hooks/api/markers/useCreateMarker";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddMarkerModal(props: any) {
  const navigate = useNavigate();
  const [longitude, setLongitude] = useState(props.coords?.longitude);
  const [latitude, setLatitude] = useState(props.coords?.latitude);
  const { createMarker } = useCreateMarker();
  const [url, setUrl] = useState<string>("");
  const { tokenValue } = useContext(AppContext);

  const handleCloseDialogWindow = () => {
    props.setOpenDialogWindow(false);
  };

  const handleCreateMarkerButton = () => {
    let lat = latitude;
    let lon = longitude;
    // ? tf is this?
    if (lat === undefined) lat = props.coords?.latitude;
    if (lon === undefined) lon = props.coords?.longitude;

    createMarker(Number(lat), Number(lon), url, tokenValue);
    handleCloseDialogWindow();
    // ? This is a workaround to refetch markers without creating a new (second) map
    // TODO find a way refetch markers and refresh a related (cluster) layer
    navigate(0);
  };

  return (
    <>
      <Dialog open={props.openDialogWindow} onClose={props.handleCloseDialogWindow}>
        <DialogTitle>Add marker</DialogTitle>
        <DialogContent sx={{ width: "400px" }}>
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
          <Button onClick={handleCreateMarkerButton}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
