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
  const [creationContextMenu, setCreationContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [modifyContextMenu, setModifyContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [openAddCategoryDialogWindow, setOpenAddCategoryDialogWindow] = useState(false);
  const [openSuccessMsg, setOpenSuccessMsg] = useState(false);
  const { getCategories, categories } = useGetCategories();
  const { tokenValue } = useContext(AppContext);

  const handleOpenAddCategoryDialogWindow = () => {
    setOpenAddCategoryDialogWindow(true);
  };

  const handleCloseCreationContextMenu = () => {
    setCreationContextMenu(null);
  };

  const handleCloseModifyContextMenu = () => {
    setModifyContextMenu(null);
    // ! workaround for closing underlapping CreationMenu when we open ModifyMenu
    handleCloseCreationContextMenu();
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

  const handleCreationContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setCreationContextMenu(
      creationContextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
  };

  const handleModifyContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setModifyContextMenu(
      modifyContextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
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
      onContextMenu={handleCreationContextMenu}
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
            <div
              onContextMenu={handleModifyContextMenu}
              key={category.name}
              style={{
                cursor: "context-menu",
              }}
            >
              <ClickableFolder
                link={`/categories/${category.name}`}
                name={category.name}
              />
            </div>
          ))}
      </Box>

      {/* Create new category context menu */}
      {tokenValue && (
        <Menu
          open={creationContextMenu !== null}
          onClose={handleCloseCreationContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            creationContextMenu !== null
              ? { top: creationContextMenu.mouseY, left: creationContextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem
            onClick={() => {
              handleCloseCreationContextMenu();
              handleOpenAddCategoryDialogWindow();
            }}
          >
            Add category
          </MenuItem>
        </Menu>
      )}

      {/* Modify existing category context menu */}
      {tokenValue && (
        <Menu
          open={modifyContextMenu !== null}
          onClose={handleCloseModifyContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            modifyContextMenu !== null
              ? { top: modifyContextMenu.mouseY, left: modifyContextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem
            onClick={() => {
              handleCloseModifyContextMenu();
              handleOpenAddCategoryDialogWindow();
            }}
          >
            Delete category
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleCloseModifyContextMenu();
              handleOpenAddCategoryDialogWindow();
            }}
          >
            Rename category
          </MenuItem>
        </Menu>
      )}

      <AddCategoryModal
        openDialogWindow={openAddCategoryDialogWindow}
        setOpenDialogWindow={setOpenAddCategoryDialogWindow}
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
