import { useEffect, useContext } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import { Category } from "models/Category";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { useGetOrCreateImageData } from "hooks/api/images/useGetOrCreateImageData";
import { useGetCategories } from "hooks/api/categories/useGetCategories";
import { useUpdateImageCategories } from "hooks/api/images/useUpdateImageCategories";

import { AppContext } from "AppContext";

export default function SelectCategoryModal(props: any) {
  const { getCategories, categories } = useGetCategories();
  const { updateImageCategories } = useUpdateImageCategories();
  const { getOrCreateImageData, imageData, setImageData } =
    useGetOrCreateImageData();
  const { tokenValue } = useContext(AppContext);

  const modalIsClosed =
    document.getElementsByClassName("MuiDialog-root").length === 0;

  const handleCloseDialogWindow = () => {
    props.setOpenDialogWindow(false);
  };

  const updateCategories = (categoryName: string) => {
    let updatedImageData = imageData;
    let updatedCategories: string[] = imageData!.categories.map(
      (category) => category.name,
    );
    if (updatedCategories?.includes(categoryName)) {
      // * uncheck category
      const index = updatedCategories.indexOf(categoryName);
      updatedCategories.splice(index, 1); // 2nd parameter means remove one item only
      updatedImageData!.categories = imageData!.categories.filter(
        (category) => category.name !== categoryName,
      );
      setImageData(updatedImageData);
    } else {
      // * check category
      updatedCategories.push(categoryName);
      updatedImageData!.categories = imageData!.categories.concat([
        new Category({ name: categoryName }),
      ]);
      setImageData(updatedImageData);
    }
    updateImageCategories(props.imgId, updatedCategories, tokenValue);
  };

  useEffect(() => {
    if (props.openDialogWindow === true && props.imgId) {
      getOrCreateImageData(props.imgId, props.imgName, [], "", tokenValue);
      getCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.openDialogWindow, props.imgId]);

  useEffect(() => {
    if (modalIsClosed === true) {
      setImageData(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsClosed]);

  return (
    <>
      <Dialog
        open={props.openDialogWindow}
        onClose={props.handleCloseDialogWindow}
        sx={{
          zIndex: 999999994, // ! image viewer has 999999993
        }}
      >
        <DialogTitle>Select Category</DialogTitle>
        <DialogContent sx={{ width: "400px" }}>
          <FormGroup>
            {imageData &&
              categories &&
              categories.map((category) => (
                <FormControlLabel
                  control={
                    imageData?.categories.find(
                      (e) => e.name === category.name,
                    ) ? (
                      <Checkbox defaultChecked />
                    ) : (
                      <Checkbox />
                    )
                  }
                  label={category.name}
                  key={category.name}
                  onChange={() => updateCategories(category.name)}
                />
              ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogWindow}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
