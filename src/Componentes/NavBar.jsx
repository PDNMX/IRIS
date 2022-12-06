import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";

//Iconos
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import { ReactComponent as PDN } from "../Imagenes/PDN.svg";
import MenuIcon from "@mui/icons-material/Menu";

//Estilos
const LinkInterno = styled(Link)({
  color: "black",
  textDecoration: "none",
});

//Estilos
const ThemeAppBar = styled(AppBar)({
  backgroundColor: "purple",
});

const pages = ["Home", "Bandera 1", "Bandera 2", "Bandera 3", "Bandera 4", "Bandera 5"];

export default function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <ThemeAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <a
            href={"https://www.plataformadigitalnacional.org/"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "purple" }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            >
              <PDN style={{ height: "30px" }} />
            </IconButton>
          </a>

          {/*Menú pequeño*/}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ ml: -3 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, index) => (
                <LinkInterno to={index === 0 ? "/" : page.replace(" ", "")}>
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <FlagCircleIcon
                      style={{ height: "30px", color: "gray" }}
                      sx={{ mr: 1 }}
                    />
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                </LinkInterno>
              ))}
            </Menu>
          </Box>
          <a
            href={"https://www.plataformadigitalnacional.org/"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "purple" }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                display: { xs: "flex", md: "none" },
                mr: "calc(90vh)",
              }}
            >
              <PDN style={{ height: "30px" }} />
            </IconButton>
          </a>
          {/*Caja que se muestra siempre*/}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => (
              <LinkInterno to={index === 0 ? "/" : page.replace(" ", "")}>
                <IconButton key={page} onClick={handleCloseNavMenu}>
                  <FlagCircleIcon
                    style={{ height: "30px", color: "beige" }}
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    variant="h6"
                    style={{ height: "30px", color: "beige" }}
                    sx={{ mr: 1 }}
                  >
                    {page}
                  </Typography>
                </IconButton>
              </LinkInterno>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </ThemeAppBar>
  );
}
