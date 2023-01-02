import { styled } from "@mui/material/styles";
import { Typography, Grid, Box, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";

//Componentes
import ResponsiveDateRangePicker from "../Componentes/ResponsiveDateRangePicker";
import RangeSlider from "../Componentes/RangeSlider";

//Graficas
import Barra from "../Graficas/Barra";
import Pie from "../Graficas/Pie";

//Iconos
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const TextoBold = styled(Typography)({
  color: "black",
  fontWeight: "bold",
  fontFamily: "Roboto",
});

function Bandera1() {
  const [value, setValue] = useState([0, 100]);
  const [dataBarraSecundaria, setdataBarraSecundaria] = useState([]);
  const [dataPie, setDataPie] = useState([]);
  const [dataBarraPrincipal, setDataBarraPrincipal] = useState([]);
  const [rangoSlider, setRangoSlider] = useState([0, 1000]);
  const [fechaInicio, setFechaInicio] = useState("2016-12-08");
  const [fechaFin, setFechaFin] = useState("2018-11-12");

  useEffect(() => {
    getDataBarraSecundaria();
    getDataPie();
    getDataBarraPrincipal();
    getRango(fechaInicio, fechaFin);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getRango(fechaInicio, fechaFin) {
    var myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $match: {
          _datetime: {
            $gte: fechaInicio,
            $lte: fechaFin,
          },
        },
      },
      {
        $group: {
          _id: null,
          max: {
            $max: "$duration",
          },
          min: {
            $min: "$duration",
          },
        },
      },
    ]);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://iris.plataformadigitalnacional.org/api/dataset/analytic_contracts_flag_1/aggregate",
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setRangoSlider([result[0]?.min, result[0]?.max]);
        getDataBarraPrincipal(value, fechaInicio, fechaFin);
      })
      .catch((error) => console.log("error", error));
  }

  function getDataBarraSecundaria() {
    var myHeaders = new Headers();

    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $group: {
          _id: "$status",
          contractId: {
            $sum: 1,
          },
        },
      },
    ]);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://iris.plataformadigitalnacional.org/api/dataset/analytic_contracts_flag_1/aggregate",
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) =>
        setdataBarraSecundaria(
          result.sort((o1, o2) => {
            if (o1.contractId < o2.contractId) {
              return -1;
            }
            return 0;
          })
        )
      )
      .catch((error) => console.log("error", error));
  }

  function getDataPie() {
    var myHeaders = new Headers();

    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $group: {
          _id: "$message",
          contractId: {
            $sum: 1,
          },
        },
      },
    ]);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://iris.plataformadigitalnacional.org/api/dataset/analytic_contracts_flag_1/aggregate",
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        // Obtenemos promedio
        let sum = 0;
        let i;

        for (i = 0; i < result.length; i++) {
          sum += result[i].contractId;
        }

        for (i = 0; i < result.length; i++) {
          result[i]["porcentaje"] = Math.round(
            (result[i].contractId * 100) / sum
          );
        }

        // Ordenamos y asignamos valor
        setDataPie(
          result.sort((o1, o2) => {
            if (o1.contractId < o2.contractId) {
              return -1;
            } else if (o1.contractId > o2.contractId) {
              return 1;
            }
            return 0;
          })
        );
      })
      .catch((error) => console.log("error", error));
  }

  function getDataBarraPrincipal(
    value = [0, 100],
    fechaInicio = "2016-12-08",
    fechaFin = "2018-11-12"
  ) {
    var myHeaders = new Headers();

    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $match: {
          duration: {
            $gte: value[0], //limite inferior
            $lte: value[1], //limite superior
          },
          _datetime: {
            $gte: fechaInicio,
            $lte: fechaFin,
          },
          status: "Datos completos",
        },
      },
      {
        $group: {
          _id: "$duration",
          contractId: {
            $sum: 1,
          },
        },
      },
    ]);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://iris.plataformadigitalnacional.org/api/dataset/analytic_contracts_flag_1/aggregate",
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) =>
        setDataBarraPrincipal(
          result.sort((o1, o2) => {
            if (o1._id < o2._id) {
              return -1;
            }
            return 0;
          })
        )
      )
      .catch((error) => console.log("error", error));
  }

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        backgroundColor: "white",
      }}
    >
      <Grid item xs={12} sm={12} md={12}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <TextoBold variant="h5">Bandera 1</TextoBold>

            <Typography textAlign={"justify"}>
              Corto plazo para que los licitadores presenten expresiones de
              interés o preparen ofertas para procesos competitivos.
            </Typography>

            <TextoBold variant="h6">Fase</TextoBold>

            <Typography textAlign={"justify"}>Licitación.</Typography>

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
              Fecha final del concurso - Fecha de inicio del concurso.
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
            <ResponsiveDateRangePicker
              titulo="Fecha de inicio"
              fecha={fechaInicio}
              funcion={getRango}
              fechaInicio={null}
              fechaFin={fechaFin}
              setFechaInicio={setFechaInicio}
            />
            <ResponsiveDateRangePicker
              titulo="Fecha de fin"
              fecha={fechaFin}
              funcion={getRango}
              fechaInicio={fechaInicio}
              fechaFin={null}
              setFechaFin={setFechaFin}
            />
          </Box>
        </Box>

        {/*Bloque selector de días*/}
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Selecciona el rango de días que estuvo abierto el proceso de
              contratación.
            </Typography>
            <RangeSlider
              value={value}
              setValue={setValue}
              color="purple"
              peticion={getDataBarraPrincipal}
              min={rangoSlider[0]}
              max={rangoSlider[1]}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              mod={100}
            />
          </Box>
        </Box>

        {/*Grafica de barras principal*/}
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Procesos de contratación con bandera roja por el tiempo para
              presentar ofertas
            </Typography>
            <Barra
              data={dataBarraPrincipal}
              keys={["contractId"]}
              indexBy={"_id"}
              bottomLegend={"Tiempo para presentar ofertas (días)"}
              leftLegend={"Número de contratos"}
              leftLegendOffset={-65}
              bottomTickRotation={-90}
              scheme={"purple_red"}
              id={"Número de contratos"}
              ml={70}
              groupMode={"grouped"}
            />
          </Box>
        </Box>
      </Grid>

      {/*Grafica de Pie*/}
      <Grid item xs={12} sm={12} md={6}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Integridad de los datos para el cálculo de la bandera (%)
            </Typography>
            <Pie
              data={dataPie}
              id={"_id"}
              value={"porcentaje"}
              translateY={-240}
            />
          </Box>
        </Box>
      </Grid>

      {/*Grafica de barras*/}
      <Grid item xs={12} sm={12} md={6}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Resumen de la integridad de los datos para el cálculo de la
              bandera
            </Typography>
            <Barra
              data={dataBarraSecundaria}
              keys={["contractId"]}
              indexBy={"_id"}
              bottomLegend={"Estado"}
              leftLegend={"Número de contratos"}
              leftLegendOffset={-65}
              bottomTickRotation={0}
              scheme={"pink_yellowGreen"}
              id={"Número de contratos"}
              ml={70}
              groupMode={"grouped"}
            />
          </Box>
        </Box>
      </Grid>

      {/*Boton de descarga*/}
      <Grid item xs={12} sm={12} md={12}>
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
