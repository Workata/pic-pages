import {
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,

} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

// * Icons
import ListItemText from '@mui/material/ListItemText';
import MapIcon from '@mui/icons-material/Map';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import WestIcon from '@mui/icons-material/West';
import CategoryIcon from '@mui/icons-material/Category';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';


export default function SideBarMenu(props: any) {

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
    <List>
      <ListItem key='WestIcon' disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: props.open ? 'initial' : 'center',
          px: 2.5,
        }}
        onClick={goBack}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: props.open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          <WestIcon />
        </ListItemIcon>
        <ListItemText primary='Go back' sx={{ opacity: props.open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  </List>
  <Divider />

  <List>
    <ListItem key='PhotoLibraryIcon' disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: props.open ? 'initial' : 'center',
          px: 2.5,
        }}
        component={Link}
        to={`/album/${process.env.REACT_APP_ROOT_FOLDER_ID}`}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: props.open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          <PhotoLibraryIcon />
        </ListItemIcon>
        <ListItemText primary='Album' sx={{ opacity: props.open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>

    <ListItem key='MapIcon' disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: props.open ? 'initial' : 'center',
            px: 2.5,
          }}
          component={Link}
          to={`/map`}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: props.open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            <MapIcon />
          </ListItemIcon>
          <ListItemText primary='Map' sx={{ opacity: props.open ? 1 : 0 }} />
        </ListItemButton>
    </ListItem>

    <ListItem key='CategoryIcon' disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: props.open ? 'initial' : 'center',
            px: 2.5,
          }}
          component={Link}
          to={`/categories`}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: props.open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary='Categories' sx={{ opacity: props.open ? 1 : 0 }} />
        </ListItemButton>
    </ListItem>
  </List>
  </>
  );
}
