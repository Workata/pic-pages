import { AppContext } from "AppContext";
import { Box, Menu, MenuItem } from "@mui/material";

// * components
import ClickableFolder from "components/ClickableFolder";
import AddCategoryModal from "components/modals/category/AddCategory";
import DeleteCategoryModal from "components/modals/category/DeleteCategory";
import RenameCategoryModal from "components/modals/category/RenameCategory";
import CategoryCreatedSnackbar from "components/snackbars/CategoryCreated";

// * hooks
import { useGetCategories } from "hooks/api/categories/useGetCategories";
import { useContext, useEffect, useState } from "react";

export default function Categories() {
  const [creationContextMenu, setCreationContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [modifyContextMenu, setModifyContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [focusedCategoryName, setFocusedCategoryName] = useState<string>("");

  const [openCreateCategoryDialogWindow, setOpenCreateCategoryDialogWindow] = useState(false);
  const [openDeleteCategoryDialogWindow, setOpenDeleteCategoryDialogWindow] = useState(false);
  const [openRenameCategoryDialogWindow, setOpenRenameCategoryDialogWindow] = useState(false);

  const [openCategoryCreatedSuccessMsg, setOpenCategoryCreatedSuccessMsg] = useState(false);
  const [openCategoryDeletedSuccessMsg, setOpenCategoryDeletedSuccessMsg] = useState(false);
  const [openCategoryRenamedSuccessMsg, setOpenCategoryRenamedSuccessMsg] = useState(false);

  const { getCategories, categories } = useGetCategories();
  const { tokenValue } = useContext(AppContext);

  const handleCloseCreationContextMenu = () => {
    setCreationContextMenu(null);
  };
  const handleCloseModifyContextMenu = () => {
    setModifyContextMenu(null);
    // ! workaround for closing underlapping CreationMenu when we open ModifyMenu
    handleCloseCreationContextMenu();
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

  const handleModifyContextMenu = (event: any) => {
    // TODO disable outer context menu (showing under innner)
    // * select closest div to target innner category text - otherwise clicking folder icon would return 'undefined'
    setFocusedCategoryName(event.target.closest("div").innerText);
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
  }, []);

  useEffect(() => {
    // * refetch categories if new one was created
    if (openCategoryCreatedSuccessMsg === true) getCategories();
  }, [openCategoryCreatedSuccessMsg]);

  useEffect(() => {
    // * refetch categories if one was deleted
    if (openCategoryDeletedSuccessMsg === true) {
      getCategories();
      setOpenCategoryDeletedSuccessMsg(false);
    }
  }, [openCategoryDeletedSuccessMsg]);

  useEffect(() => {
    // * refetch categories if one was renamed
    if (openCategoryRenamedSuccessMsg === true) {
      getCategories();
      setOpenCategoryRenamedSuccessMsg(false);
    }
  }, [openCategoryRenamedSuccessMsg]);

  return (
    <>
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
                onContextMenu={(event) => {
                  handleModifyContextMenu(event);
                }}
                key={category.name}
                className="categoryFolder"
                style={{
                  cursor: "context-menu",
                }}
              >
                <ClickableFolder link={`/categories/${category.name}`} name={category.name} />
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
                ? {
                    top: creationContextMenu.mouseY,
                    left: creationContextMenu.mouseX,
                  }
                : undefined
            }
          >
            <MenuItem
              onClick={() => {
                handleCloseCreationContextMenu();
                setOpenCreateCategoryDialogWindow(true);
              }}
            >
              Add
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
                ? {
                    top: modifyContextMenu.mouseY,
                    left: modifyContextMenu.mouseX,
                  }
                : undefined
            }
          >
            <MenuItem
              onClick={() => {
                handleCloseModifyContextMenu();
                setOpenDeleteCategoryDialogWindow(true);
              }}
            >
              Delete
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleCloseModifyContextMenu();
                setOpenRenameCategoryDialogWindow(true);
              }}
            >
              Rename
            </MenuItem>
          </Menu>
        )}
      </div>

      {/* 
      Instead of one state '...SuccessMessage' there should be two: 
        1) '...SuccessMessage' --- used for snackbar messages
        2) 'categoryCreated' / 'categoryDeleted' --- used in useEffect for refetching categories -> change flag there
    */}

      <AddCategoryModal
        openDialogWindow={openCreateCategoryDialogWindow}
        setOpenDialogWindow={setOpenCreateCategoryDialogWindow}
        setOpenSuccessMsg={setOpenCategoryCreatedSuccessMsg}
      />

      <DeleteCategoryModal
        openDialogWindow={openDeleteCategoryDialogWindow}
        setOpenDialogWindow={setOpenDeleteCategoryDialogWindow}
        setOpenSuccessMsg={setOpenCategoryDeletedSuccessMsg}
        categoryName={focusedCategoryName}
      />

      <RenameCategoryModal
        openDialogWindow={openRenameCategoryDialogWindow}
        setOpenDialogWindow={setOpenRenameCategoryDialogWindow}
        setOpenSuccessMsg={setOpenCategoryRenamedSuccessMsg}
        categoryName={focusedCategoryName}
      />

      <CategoryCreatedSnackbar open={openCategoryCreatedSuccessMsg} setOpen={setOpenCategoryCreatedSuccessMsg} />
    </>
  );
}
