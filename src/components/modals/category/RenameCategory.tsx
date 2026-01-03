import { useContext, useState } from "react";

// * mui
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import { AppContext } from "AppContext";

// * hooks
import { useRenameCategory } from "hooks/api/categories/useRenameCategory";
import { TextField } from "@mui/material";

export default function RenameCategoryModal(props: any) {
  const { renameCategory } = useRenameCategory();
  const [renamedCategory, setRenamedCategory] = useState<string>("");
  const { tokenValue } = useContext(AppContext);

  const handleCloseDialogWindow = () => {
    props.setOpenDialogWindow(false);
  };

  const handleDeleteCategoryButton = async () => {
    // TODO handle error message
    await renameCategory(props.categoryName, renamedCategory, tokenValue);
    handleCloseDialogWindow();
    props.setOpenSuccessMsg(true);
  };

  return (
    <>
      <Dialog open={props.openDialogWindow} onClose={handleCloseDialogWindow}>
        <DialogTitle>Rename category</DialogTitle>
        <DialogContent sx={{ width: "400px" }}>
          <TextField disabled label="Old name" variant="standard" defaultValue={props.categoryName} />
          <br /> <br />
          <TextField label="New name" variant="standard" onChange={(event) => setRenamedCategory(event.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogWindow}>Close</Button>
          <Button onClick={handleDeleteCategoryButton}>Rename</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
