import { useState, useEffect, useContext, forwardRef } from "react";
import { Box, Menu, MenuItem } from "@mui/material";

// * mui
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

// * components
import ClickableFolder from "components/ClickableFolder";
import AddCategoryModal from "components/modals/AddCategory";

// * hooks
import { useGetCategories } from "hooks/api/categories/useGetCategories";

import { AppContext } from "AppContext";

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  },
);

export default function Categories() {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [openDialogWindow, setOpenDialogWindow] = useState(false);
  const [openSuccessMsg, setOpenSuccessMsg] = useState(false);
  const { getCategories, categories } = useGetCategories();
  const { tokenValue } = useContext(AppContext);

  const handleOpenDialogWindow = () => {
    setOpenDialogWindow(true);
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccessMsg(false);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null,
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // * refetch categories if new one was created
    if (openSuccessMsg) getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSuccessMsg]);

  return (
    <div
      onContextMenu={handleContextMenu}
      style={{
        cursor: "context-menu",
        height: "85vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          columnGap: "20px",
          flexWrap: "wrap",
          rowGap: "20px",
        }}
      >
        {categories &&
          categories.map((category) => (
            <ClickableFolder
              key={category.name}
              link={`/categories/${category.name}`}
              name={category.name}
            />
          ))}
      </Box>

      {tokenValue && (
        <Menu
          open={contextMenu !== null}
          onClose={handleCloseContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem
            onClick={() => {
              handleCloseContextMenu();
              handleOpenDialogWindow();
            }}
          >
            Add category
          </MenuItem>
        </Menu>
      )}

      <AddCategoryModal
        openDialogWindow={openDialogWindow}
        setOpenDialogWindow={setOpenDialogWindow}
        setOpenSuccessMsg={setOpenSuccessMsg}
      />

      <Snackbar
        open={openSuccessMsg}
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
    </div>
  );
}
