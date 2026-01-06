import { AppContext } from "AppContext";
// * Icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
// * mui
import { Box, Button, Divider, IconButton, Toolbar, Typography } from "@mui/material";
import MuiAppBar, { type AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import { type CSSObject, styled, type Theme, useTheme } from "@mui/material/styles";
// * components
import SideBarMenu from "components/SideBarMenu";

import { useGetFolderPath } from "hooks/api/images/useGetFolderPath";
import type { ChainedFolder } from "models/Folder";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function AppWrapper(props: any) {
  // * aggregates App Bar and Side Menu (Drawer)
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentFolderId } = useParams();
  const { tokenValue, setTokenValue, deleteTokenCookie } = useContext(AppContext);
  const { getFolderPath, chainedFolders } = useGetFolderPath();
  // * state of sidebar - opened/close (user requested opened by deault)
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (currentFolderId) {
      getFolderPath(currentFolderId);
    }
  }, [currentFolderId]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* <CssBaseline /> */}
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box component={Link} to="/" sx={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" noWrap component="div">
              TomTol {tokenValue && " - Admin"}
            </Typography>
          </Box>

          <Box
            id="path-container"
            sx={{
              display: "flex",
              columnGap: "5px",
              marginLeft: "30px",
            }}
          >
            <Box component={Link} to="/" sx={{ textDecoration: "none", color: "inherit" }}>
              <Typography variant="h6" noWrap component="div">
                Home
              </Typography>
            </Box>
            {chainedFolders?.map((folder: ChainedFolder) => (
              <Box
                key={folder.id}
                component={Link}
                to={`/album/${folder.id}`}
                sx={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography variant="h6" noWrap component="div">
                  <ChevronRightIcon sx={{ verticalAlign: "-5px" }} /> {folder.name}
                </Typography>
              </Box>
            ))}
          </Box>

          {tokenValue ? (
            <Button
              color="inherit"
              sx={{ marginLeft: "auto" }}
              onClick={() => {
                setTokenValue("");
                deleteTokenCookie("token");
                navigate("/"); // redirect to the homepage after logout
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              color="inherit"
              sx={{ marginLeft: "auto" }}
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <SideBarMenu open={open} />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 2 }} id="wrapperBox">
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
