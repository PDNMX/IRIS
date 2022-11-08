import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import GitHubIcon from "@mui/icons-material/GitHub";
import YouTubeIcon from "@mui/icons-material/YouTube";
import HomeIcon from "@mui/icons-material/Home";

const CustomLink = styled(Link)({
  color: "black",
  textDecoration: "none",
});

function Navegacion() {
  return (
    <div>
      <Divider />
      <List>
        <CustomLink to="/">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
        </CustomLink>
        {["Bandera 1", "Bandera 2", "Bandera 3", "Bandera 4"].map(
          (text, index) => (
            <CustomLink to={text.replace(" ", "")}>
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <FlagCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            </CustomLink>
          )
        )}
        <Divider />
        <CustomLink to="/Youtube">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <YouTubeIcon />
              </ListItemIcon>
              <ListItemText primary={"Youtube"} />
            </ListItemButton>
          </ListItem>
        </CustomLink>

        <CustomLink to="/Github">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <GitHubIcon />
              </ListItemIcon>
              <ListItemText primary={"Repositorio"} />
            </ListItemButton>
          </ListItem>
        </CustomLink>
      </List>
    </div>
  );
}

export default Navegacion;
