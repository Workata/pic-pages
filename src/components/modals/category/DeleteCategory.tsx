import { AppContext } from "AppContext";
import Button from "@mui/material/Button";
// * mui
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// * hooks
import { useDeleteCategory } from "hooks/api/categories/useDeleteCategory";
import { useContext } from "react";

export default function DeleteCategoryModal(props: any) {
  const { deleteCategory } = useDeleteCategory();
  const { tokenValue } = useContext(AppContext);

  const handleCloseDialogWindow = () => {
    props.setOpenDialogWindow(false);
  };

  const handleDeleteCategoryButton = async () => {
    // TODO handle error message
    await deleteCategory(props.categoryName, tokenValue);
    handleCloseDialogWindow();
    props.setOpenSuccessMsg(true);
  };

  return (
    <Dialog open={props.openDialogWindow} onClose={handleCloseDialogWindow}>
      <DialogTitle>Delete category</DialogTitle>
      <DialogContent sx={{ width: "400px" }}>
        Are you sure you want to delete '{props.categoryName}' category?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialogWindow}>No</Button>
        <Button onClick={handleDeleteCategoryButton}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
