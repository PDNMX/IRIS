import { styled } from "@mui/material/styles";
import {
  Typography,
  Grid,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";

//Iconos
import CircleIcon from '@mui/icons-material/Circle';
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GitHubIcon from "@mui/icons-material/GitHub";

//Imagenes
import { ReactComponent as LogoPDN } from "../Imagenes/PDN.svg";
import LogoSNA from "../Imagenes/SNA.png";
import Licencia from "../Imagenes/Licencia.png";

//Estilos
const Footer = styled("footer")({
  color: "black",
  margin: 0,
  padding: 20,
  position: "sticky",
  background: "mediumpurple",
});

const CustomLink = styled("a")({
  color: "black",
  textDecoration: "none",
});

const SubTitulo = styled(Typography)({
  fontFamily: "Times New Roman",
});

function PieDePagina() {
  return (
    <Footer>
      <Grid container>
        {/*Primer Columna*/}
        <Grid item xs={12} sm={12} md={4}>
          <Box sx={{ ml: 2, mr: 2 }}>
            <div align="left">
              <LogoPDN style={{ height: "30px" }} />
              <Typography fontWeight={"bold"}>
                Plataforma Digital Nacional
              </Typography>
            </div>
            <SubTitulo>Inteligencia de Datos Anticorrupción</SubTitulo>
            <div>
              <CustomLink
                href={"https://www.facebook.com/SESNAOficial/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton>
                  <FacebookIcon fontSize="large" sx={{ ml: -1.5 }} />
                </IconButton>
              </CustomLink>

              <CustomLink
                href={"https://twitter.com/SESNAOficial"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton>
                  <TwitterIcon fontSize="large" />
                </IconButton>
              </CustomLink>

              <CustomLink
                href={
                  "https://www.youtube.com/channel/UCRUpiHth_WRkNo2sBmZIyfQ"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton>
                  <YouTubeIcon fontSize="large" />
                </IconButton>
              </CustomLink>

              <CustomLink
                href={"https://github.com/PDNMX"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton>
                  <GitHubIcon fontSize="large" />
                </IconButton>
              </CustomLink>
            </div>
          </Box>
        </Grid>

        {/*Segunda Columna*/}
        <Grid item xs={12} sm={6} md={2}>
          <List>
            {[
              "Declaraciones",
              "Servidores",
              "Sancionados",
              "Contrataciones",
            ].map((text, index) => (
              <CustomLink
                href={
                  "https://www.plataformadigitalnacional.org/" +
                  text.toLowerCase()
                }
                key={index}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ListItem
                  disablePadding
                  style={{ height: "30px", color: "azure" }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <CircleIcon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              </CustomLink>
            ))}
          </List>
        </Grid>

        {/*Tercer Columna*/}
        <Grid item xs={12} sm={6} md={3}>
          <List>
            {[
              "Blog",
              "Preguntas frecuentes",
              "¿Qué es la PDN?",
              "Términos de uso",
            ].map((text, index) => (
              <CustomLink
                href={
                  "https://www.plataformadigitalnacional.org/" +
                  (index === 0
                    ? "blog"
                    : index === 1
                    ? "faq"
                    : index === 2
                    ? "about"
                    : index === 3
                    ? "terminos"
                    : text)
                }
                key={index}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ListItem
                  disablePadding
                  style={{ height: "30px", color: "azure" }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <CircleIcon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              </CustomLink>
            ))}
          </List>
        </Grid>

        {/*Cuarta Columna*/}
        <Grid item xs={12} sm={12} md={3}>
          <Box sx={{ ml: 5 }}>
            <div align="center">
              <img src={LogoSNA} alt="logoSNA" style={{ height: "85px" }} />
            </div>
            <div align="right">
              <img src={Licencia} alt="Licencia" style={{ height: "30px" }} />
            </div>
          </Box>
        </Grid>
      </Grid>
    </Footer>
  );
}

export default PieDePagina;
