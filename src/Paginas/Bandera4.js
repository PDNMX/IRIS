import { styled } from "@mui/material/styles";
import { Typography, Grid, Box, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";

//Componentes
import ResponsiveDateRangePicker from "../Componentes/ResponsiveDateRangePicker";
import Comando from "../Componentes/Comando";

//Graficas
import Barra from "../Graficas/Barra";
import Pie from "../Graficas/Pie";
import Line from "../Graficas/Line";

//Iconos
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const API = process.env.REACT_APP_API;

const TextoBold = styled(Typography)({
  color: "black",
  fontWeight: "bold",
  fontFamily: "Roboto",
});

function Bandera4() {
  const [databarra_1, setdatabarra_1] = useState([]);
  const [dataPie_0, setDataPie_0] = useState([]);
  const [dataPie_1, setDataPie_1] = useState([]);
  const [dataPie_2, setDataPie_2] = useState([]);
  const [databarra_0, setDatabarra_0] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("2015-12-29");
  const [fechaFin, setFechaFin] = useState("2018-11-09");
  const [dataLine, setDataLine] = useState([]);
  const [databarra_2, setdatabarra_2] = useState([]);
  const [rangoAumentoPorcentual, setRangoAumentoPorcentual] = useState([0, 0]);
  const [rangoInferior, setRangoInferior] = useState(0);
  const [rangoSuperior, setRangoSuperior] = useState(100);

  useEffect(() => {
    getDatabarra_1();
    getDataPie_0();
    getDataPie_1();
    getDataPie_2();
    getDatabarra_0();
    getDatabarra_2();
    getDataLinea();
    getRangoAumentoPorcentual(fechaInicio, fechaFin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getDatabarra_0(
    rangoInferior = -1,
    rangoSuperior = 100,
    fechaInicio = "2015-12-29",
    fechaFin = "2018-11-09"
  ) {
    var myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $match: {
          _percentage: {
            $gte: rangoInferior,
            $lte: rangoSuperior,
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
          _id: "$_percentage",
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
      `${API}/dataset/analytic_contracts_flag_4/aggregate`,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setDatabarra_0(
          result.sort((o1, o2) => {
            if (o1._id < o2._id) {
              return -1;
            }
            return 0;
          })
        );
      })
      .catch((error) => console.log("error", error));
  }

  function getDataPie_0() {
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
      `${API}/dataset/analytic_contracts_flag_4/aggregate`,
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
        setDataPie_0(
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

  function getDatabarra_1() {
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
      `${API}/dataset/analytic_contracts_flag_4/aggregate`,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) =>
        setdatabarra_1(
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

  function getDataLinea() {
    var myHeaders = new Headers();

    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $match: {
          _percentage: {
            $gte: 1,
            $lte: 200,
          },
        },
      },
      {
        $group: {
          _id: {
            $year: "$_datetime",
          },
          awardValue: {
            $sum: "$awardValue",
          },
          contractValue: {
            $sum: "$contractValue",
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
      `${API}/dataset/analytic_contracts_flag_4/aggregate`,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        let tmp = [];
        let obj = {};
        let dataAdjudicacion = [];
        let dataContratacion = [];

        //Clasificamos la información
        for (let i = 0; i < result.length; i++) {
          dataAdjudicacion.push({ x: result[i]._id, y: result[i].awardValue });
          dataContratacion.push({
            x: result[i]._id,
            y: result[i].contractValue,
          });
        }

        //Unimos la información
        obj["id"] = "Adjudicación";
        obj["data"] = dataAdjudicacion;
        tmp.push(obj);
        obj = {};
        obj["id"] = "Contratación";
        obj["data"] = dataContratacion;
        tmp.push(obj);

        // Ordenamos los valores
        for (let i = 0; i < tmp.length; i++) {
          tmp[i].data.sort((o1, o2) => {
            if (o1.x < o2.x) {
              return -1;
            }
            return 0;
          });
        }

        setDataLine(tmp);
      })
      .catch((error) => console.log("error", error));
  }

  function getDatabarra_2() {
    var myHeaders = new Headers();

    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $match: {
          _percentage: {
            $gte: 1,
            $lte: 200,
          },
        },
      },
      {
        $group: {
          _id: "$procurementMethod",
          awardValue: {
            $sum: "$awardValue",
          },
          contractValue: {
            $sum: "$contractValue",
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
      `${API}/dataset/analytic_contracts_flag_4/aggregate`,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) =>
        setdatabarra_2(
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

  function getDataPie_1() {
    var myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $match: {
          _percentage: {
            $gte: 1,
            $lte: 200,
          },
        },
      },
      {
        $group: {
          _id: "$procurementMethod",
          awardValue: {
            $sum: "$awardValue",
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
      `${API}/dataset/analytic_contracts_flag_4/aggregate`,
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
          sum += result[i].awardValue;
        }

        for (i = 0; i < result.length; i++) {
          result[i]["porcentaje"] = Math.round(
            (result[i].awardValue * 100) / sum
          );
        }

        // Ordenamos y asignamos valor
        setDataPie_1(
          result.sort((o1, o2) => {
            if (o1.awardValue < o2.awardValue) {
              return -1;
            } else if (o1.awardValue > o2.awardValue) {
              return 1;
            }
            return 0;
          })
        );
      })
      .catch((error) => console.log("error", error));
  }

  function getDataPie_2() {
    var myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $match: {
          _percentage: {
            $gte: 1,
            $lte: 200,
          },
        },
      },
      {
        $group: {
          _id: "$procurementMethod",
          contractValue: {
            $sum: "$contractValue",
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
      `${API}/dataset/analytic_contracts_flag_4/aggregate`,
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
          sum += result[i].contractValue;
        }

        for (i = 0; i < result.length; i++) {
          result[i]["porcentaje"] = Math.round(
            (result[i].contractValue * 100) / sum
          );
        }

        // Ordenamos y asignamos valor
        setDataPie_2(
          result.sort((o1, o2) => {
            if (o1.contractValue < o2.contractValue) {
              return -1;
            } else if (o1.contractValue > o2.contractValue) {
              return 1;
            }
            return 0;
          })
        );
      })
      .catch((error) => console.log("error", error));
  }

  function getRangoAumentoPorcentual(fechaInicio, fechaFin) {
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
            $max: "$_percentage",
          },
          min: {
            $min: "$_percentage",
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
      `${API}/dataset/analytic_contracts_flag_4/aggregate`,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) =>
        setRangoAumentoPorcentual([result[0].min, result[0].max])
      )
      .catch((error) => console.log("error", error));
  }

  function actualizaDataBarra_0(
    rangoInferior,
    rangoSuperior,
    fechaInicio,
    fechaFin
  ) {
    getRangoAumentoPorcentual(fechaInicio, fechaFin);
    getDatabarra_0(rangoInferior, rangoSuperior, fechaInicio, fechaFin);
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
            <TextoBold variant="h5">Bandera 4</TextoBold>

            <Typography textAlign={"justify"}>
              Gran diferencia porcentual entre el monto de adjudicación del
              contrato y el monto final del contrato.
            </Typography>

            <TextoBold variant="h6">Fase</TextoBold>

            <Typography textAlign={"justify"}>
              Adjudicación/Contrato.
            </Typography>

            <TextoBold variant="h6">¿Por qué es una bandera roja?</TextoBold>

            <Typography textAlign={"justify"}>
              Una diferencia significativa entre el precio de adjudicación y el
              precio final del contrato puede ser señal de:
              <ul>
                <li>
                  Existencia de acuerdos "a puerta cerrada" entre proveedores y
                  compradores. En algunos casos, el licitante ofrece un precio
                  artificialmente bajo para ganar un contrato y luego aumenta
                  los precios a través de enmiendas del contrato durante su
                  implementación.
                </li>
                <li>
                  Mala planificación en los procesos de adjudicación. En algunos
                  casos se subestima el costo del bien y servicio, reportando un
                  monto de adjudicación muy pequeño con respecto al monto final
                  del contrato.
                </li>
              </ul>
            </Typography>

            <TextoBold variant="h6">Información que necesitamos</TextoBold>
            <ul>
              <li>ID de adjudicación</li>
              <li>Monto de adjudicación</li>
              <li>ID del contrato</li>
              <li>Monto del contrato</li>
            </ul>

            <TextoBold variant="h6">¿Cómo se calcula?</TextoBold>
            <Typography textAlign={"justify"}>
              (Monto de contrato final - monto de adjudicación) / (monto de
              adjudicación).
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
              funcion={null}
              funcion2={actualizaDataBarra_0}
              fechaInicio={null}
              fechaFin={fechaFin}
              rangoInferior={rangoInferior}
              rangoSuperior={rangoSuperior}
              setFechaInicio={setFechaInicio}
            />
            <ResponsiveDateRangePicker
              titulo="Fecha de fin"
              fecha={fechaFin}
              funcion={null}
              funcion2={actualizaDataBarra_0}
              fechaInicio={fechaInicio}
              fechaFin={null}
              rangoInferior={rangoInferior}
              rangoSuperior={rangoSuperior}
              setFechaFin={setFechaFin}
            />
          </Box>
        </Box>

        {/*Bloque selector de aumento porcentual*/}
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Selecciona el aumento porcentual [{rangoAumentoPorcentual[0]},
              {rangoAumentoPorcentual[1]}]
            </Typography>
            <Comando
              Label={"Rango inferior"}
              setComando={setRangoInferior}
              actualiza={getDatabarra_0}
              rangoSuperior={rangoSuperior}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              comando={rangoInferior}
              type={"number"}
            />
            <Comando
              Label={"Rango superior"}
              setComando={setRangoSuperior}
              actualiza={getDatabarra_0}
              rangoInferior={rangoInferior}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              comando={rangoSuperior}
              type={"number"}
            />
          </Box>
        </Box>

        {/*Grafica de barras principal*/}
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Procesos de contratación con bandera roja por la diferencia
              porcentual entre monto de adjudicación y monto final del contrato
            </Typography>
            <Barra
              data={databarra_0}
              keys={["contractId"]}
              indexBy={"_id"}
              bottomLegend={"Diferencia porcentual ((Contratación - Adjudicación) / Adjudicación)"}
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
              Calidad de los datos para cálculo de la bandera (%)
            </Typography>
            <Pie
              data={dataPie_0}
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
              Resumen de la calidad de los datos para cálculo de la bandera
            </Typography>
            <Barra
              data={databarra_1}
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

      {/*Grafica de linea*/}
      <Grid item xs={12} sm={12} md={6}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Monto adjudicación (inicial) y contratación (final)
            </Typography>
            <Line
              data={dataLine}
              bottomLegend={"Año"}
              leftLegend={"Monto (MDP)"}
              leftLegendOffset={-100}
              scheme={"set2"}
              marginLeft={105}
            />
          </Box>
        </Box>
      </Grid>

      {/*Grafica de barras 2*/}
      <Grid item xs={12} sm={12} md={6}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Monto de adjudicación y monto de contrato
            </Typography>
            <Barra
              data={databarra_2}
              keys={["contractValue", "awardValue"]}
              indexBy={"_id"}
              bottomLegend={"Método de adjudicación"}
              leftLegend={"Monto (MDP)"}
              leftLegendOffset={-100}
              bottomTickRotation={0}
              scheme={"pink_yellowGreen"}
              id={"Número de contratos"}
              ml={110}
              groupMode={"grouped"}
            />
          </Box>
        </Box>
      </Grid>

      {/*Grafica de Pie 2*/}
      <Grid item xs={12} sm={12} md={6}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Distribución de los montos adjudicados por método de adjudicación
              (%)
            </Typography>
            <Pie
              data={dataPie_1}
              id={"_id"}
              value={"porcentaje"}
              translateY={-240}
            />
          </Box>
        </Box>
      </Grid>

      {/*Grafica de Pie 3*/}
      <Grid item xs={12} sm={12} md={6}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Distribución de los montos contratados por método de adjudicación
              (%)
            </Typography>
            <Pie
              data={dataPie_2}
              id={"_id"}
              value={"porcentaje"}
              translateY={-240}
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

export default Bandera4;
