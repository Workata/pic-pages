import FolderIcon from "@mui/icons-material/Folder";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function ClickableFolder(props: any) {
  return (
    <Button
      variant="contained"
      component={Link}
      to={props.link}
      sx={{
        textTransform: "none",
      }}
    >
      <FolderIcon sx={{ marginRight: "15px" }} /> {props.name}
    </Button>
  );
}
