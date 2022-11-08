import { styled } from "@mui/material/styles";
import { Typography, Grid, Box, IconButton } from "@mui/material";

//Componentes
import ResponsiveDateRangePicker from "../Componentes/ResponsiveDateRangePicker";
import RangeSlider from "../Componentes/RangeSlider";

//Graficas
import Barra from "../Graficas/Barra";
import Pie from "../Graficas/Pie";

//Datos
import { data } from "../Datos/DatosBarra";
import { data as dataPie } from "../Datos/DatosPie";

//Icononos
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const TextoBold = styled(Typography)({
  color: "black",
  fontWeight: "bold",
  fontFamily: "Roboto",
});

function Bandera1() {
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        sx={{
          minHeight: "100vh",
          backgroundColor: "beige",
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <TextoBold variant="h5">Bandera 1</TextoBold>

            <Typography textAlign={"justify"}>
              Corto plazo para que los licitadores presenten expresiones de
              interés o preparen ofertas para procesos competitivos.
            </Typography>

            <TextoBold variant="h6">¿Por qué es una bandera roja?</TextoBold>

            <Typography textAlign={"justify"}>
              Un periodo de tiempo insuficiente no permitirá a todos los
              licitantes interesados preparar y presentar ofertas de calidad.
              Los licitantes que hayan sido “informados” antes de la apertura
              pública pueden tener ventaja injusta teniendo más tiempo para
              preparar las ofertas.
            </Typography>

            <TextoBold variant="h6">Información que necesitamos</TextoBold>
            <ul>
              <li>ID del concurso</li>
              <li>Método de contratación</li>
              <li>Fecha de inicio del concurso</li>
              <li>Fecha final del concurso</li>
            </ul>

            <TextoBold variant="h6">¿Cómo se calcula?</TextoBold>
            <Typography textAlign={"justify"}>
              Fecha final del concurso - Fecha de inicio del concurso.{"\n"}
            </Typography>
          </Box>
        </Box>

        {/*Bloque selector de rango de fechas*/}
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Selecciona la fecha de inicio y final del periodo de
              contrataciones a analizar.
            </Typography>
            <ResponsiveDateRangePicker titulo="Fecha de inicio" />
            <ResponsiveDateRangePicker titulo="Fecha de fin" />
          </Box>
        </Box>

        {/*Bloque selector de días*/}
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Selecciona el rango de días que estuvo abierto el proceso de
              contratación.
            </Typography>
            <RangeSlider color="purple" />
          </Box>
        </Box>

        {/*Grafica de barras principal*/}
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Procesos de contratación con bandera roja por el tiempo para
              presentar ofertas.
            </Typography>
            <Barra data={data} />
          </Box>
        </Box>
      </Grid>

      {/*Grafica de Pie*/}
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        sx={{
          backgroundColor: "beige",
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Integridad de los datos para el cálculo de la bandera
            </Typography>
            <Pie data={dataPie} />
          </Box>
        </Box>
      </Grid>

      {/*Grafica de barras*/}
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        sx={{
          backgroundColor: "beige",
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Resumen de la integridad de los datos para el cálculo de la
              bandera.
            </Typography>
            <Barra data={data} />
          </Box>
        </Box>
      </Grid>

      {/*Boton de descarga*/}
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        sx={{
          backgroundColor: "beige",
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }} textAlign="center">
            <TextoBold paragraph variant="h4">
              Descargar todos los datos.
            </TextoBold>
            <a
              href={
                "https://datos.gob.mx/busca/organization/contrataciones-abiertas"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton sx={{ color: "purple" }}>
                <CloudDownloadIcon style={{ fontSize: "150px" }} />
              </IconButton>
            </a>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Bandera1;
