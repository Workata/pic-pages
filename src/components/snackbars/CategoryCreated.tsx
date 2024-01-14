import Snackbar from "@mui/material/Snackbar";
import { Alert } from "./shared/alert";

export default function CategoryCreatedSnackbar(props: any) {
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    props.setOpen(false);
  };

  return (
    <Snackbar
      open={props.open}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity="success"
        sx={{ width: "100%" }}
      >
        New category has been created!
      </Alert>
    </Snackbar>
  );
}
