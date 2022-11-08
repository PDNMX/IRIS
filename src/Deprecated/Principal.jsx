import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Box, Drawer, CssBaseline, Toolbar, IconButton } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Navegacion from "./Navegacion";
import { ReactComponent as PDN } from "../Imagenes/PDN.svg";
import Bandera1 from "../Paginas/Bandera1";
import Bandera2 from "../Paginas/Bandera2";
import Bandera3 from "../Paginas/Bandera3";
import Bandera4 from "../Paginas/Bandera4";
import PieDePagina from "./PieDePagina";
import Home from "../Paginas/Home";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(0),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

//Temas
const ThemeDrawerHeader = styled(DrawerHeader)({
  backgroundColor: "beige",
});

const ThemeAppBar = styled(AppBar)({
  backgroundColor: "purple",
});

const ThemeMain = styled(Main)({
  backgroundColor: "beige",
});

const ThemeDrawer = styled(Drawer)({
  backgroundColor: "beige",
});

export default function Principal() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <ThemeAppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton>
              <Link to="/">
                <PDN style={{ height: "30px" }} />
              </Link>
            </IconButton>
          </Toolbar>
        </ThemeAppBar>
        <ThemeDrawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <ThemeDrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </ThemeDrawerHeader>
          <Navegacion />
        </ThemeDrawer>
        <ThemeMain open={open}>
          <DrawerHeader />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/Bandera1" element={<Bandera1 />} />
            <Route exact path="/Bandera2" element={<Bandera2 />} />
            <Route exact path="/Bandera3" element={<Bandera3 />} />
            <Route exact path="/Bandera4" element={<Bandera4 />} />
          </Routes>
          <PieDePagina />
        </ThemeMain>
      </Box>
    </Router>
  );
}
