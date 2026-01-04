import { AppContext } from "AppContext";
import Button from "@mui/material/Button";
// * mui
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
// * hooks
import { useCreateCategory } from "hooks/api/categories/useCreateCategory";
import { useContext, useState } from "react";

export default function AddCategoryModal(props: any) {
  const [newCategory, setNewCategory] = useState<string>("");
  const { createCategory } = useCreateCategory();
  const { tokenValue } = useContext(AppContext);

  const handleCloseDialogWindow = () => {
    props.setOpenDialogWindow(false);
  };

  const handleCreateCategoryButton = async () => {
    // TODO handle error message
    await createCategory(newCategory, tokenValue);
    handleCloseDialogWindow();
    props.setOpenSuccessMsg(true);
  };

  return (
    <>
      <Dialog open={props.openDialogWindow} onClose={handleCloseDialogWindow}>
        <DialogTitle>Add category</DialogTitle>
        <DialogContent sx={{ width: "400px" }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Category name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => setNewCategory(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogWindow}>Cancel</Button>
          <Button onClick={handleCreateCategoryButton}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
