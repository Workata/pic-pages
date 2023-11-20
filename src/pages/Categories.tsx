import React, {useState, useEffect, useContext} from "react";
import {
  Box,
  Typography,
  Menu,
  MenuItem

} from "@mui/material";
import { Link } from "react-router-dom";
import { getCategories, createCategory } from "../services/categories";
import { Category } from "../models/Category";

// * mui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

// * components
import ClickableFolder from "../components/ClickableFolder";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Categories() {

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [categories, setCategories] = useState<Category[]>();
  const [newCategory, setNewCategory] = useState<string>("");
  const [openDialogWindow, setOpenDialogWindow] = useState(false);
  const [openSuccessMsg, setOpenSuccessMsg] = useState(false);

  const handleOpenDialogWindow = () => {
    setOpenDialogWindow(true);
  };

  const handleCloseDialogWindow = () => {
    setOpenDialogWindow(false);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
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

  const fetchCategories = () => {
    getCategories((res: any) => {
      let categories = res.data.map(
        (o: any) => new Category({name: o.name})
      )
      setCategories(categories);
    }, (err: any) => {
      console.log(err);
    });
  }

  const createNewCategory = () => {
    console.log(newCategory);
    createCategory({"name": newCategory}, (res: any) => {
      console.log(res);
      handleCloseDialogWindow();
      fetchCategories();
      setOpenSuccessMsg(true);
    }, (err: any) => {
      console.log(err);
    });
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div onContextMenu={handleContextMenu} style={{
       cursor: 'context-menu',
      //  borderStyle: 'solid',
      //  borderColor: 'red',
       height: '85vh'
    }}>
      <Box sx={{display: 'flex', columnGap: '20px'}}> 
        {categories && categories.map(
          (category) => <ClickableFolder key={category.name} link={`/categories/${category.name}`} name={category.name}/>
        )}
      </Box>

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
        <MenuItem onClick={() => {
          handleCloseContextMenu();
          handleOpenDialogWindow();
          }
        }>Add category</MenuItem>
      </Menu>

      <Dialog open={openDialogWindow} onClose={handleCloseDialogWindow}>
        <DialogTitle>Add category</DialogTitle>
        <DialogContent sx={{width: '400px'}}>
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
          <Button onClick={createNewCategory}>Add</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSuccessMsg} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          New category has been created!
        </Alert>
      </Snackbar>

    </div>
  );
}
