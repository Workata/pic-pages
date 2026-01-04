import CategoryIcon from "@mui/icons-material/Category";
import MapIcon from "@mui/icons-material/Map";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { List, ListItem, ListItemButton, ListItemIcon } from "@mui/material";
// * Icons
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";

export default function SideBarMenu(props: any) {
  return (
    <>
      <List>
        <ListItem key="PhotoLibraryIcon" disablePadding sx={{ display: "block" }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: props.open ? "initial" : "center",
              px: 2.5,
            }}
            component={Link}
            to={`/album/${process.env.REACT_APP_ROOT_FOLDER_ID}`}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: props.open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <PhotoLibraryIcon />
            </ListItemIcon>
            <ListItemText primary="Album" sx={{ opacity: props.open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        <ListItem key="MapIcon" disablePadding sx={{ display: "block" }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: props.open ? "initial" : "center",
              px: 2.5,
            }}
            component={Link}
            to={`/map`}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: props.open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <MapIcon />
            </ListItemIcon>
            <ListItemText primary="Map" sx={{ opacity: props.open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>

        <ListItem key="CategoryIcon" disablePadding sx={{ display: "block" }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: props.open ? "initial" : "center",
              px: 2.5,
            }}
            component={Link}
            to={`/categories`}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: props.open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Categories" sx={{ opacity: props.open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
}
