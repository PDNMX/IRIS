import Calendario from "../Graficas/calendario";
import { Grid, Box, Typography, createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import {data} from "../Datos/DatosCalendario"

function Home() {

  const theme = createTheme({
    typography:{
      fontFamily:["Times New Roman"],
    },
    overrides:{
      MuiCssBaseLine:{
        '@global':{
          '@font-face': ["Times New Roman"],
        }
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
    <Grid container>
    <Grid item xs={12} sm={12}md={12} sx={{minHeight: "100vh", backgroundColor: "beige"}}>
      <Box>
      <Typography variant='h2' align="center">
        Calendario de avances
      </Typography>

      <Calendario data={data} /> 
      </Box>
    </Grid>
    </Grid>
    </ThemeProvider>
  );
}

export default Home;
