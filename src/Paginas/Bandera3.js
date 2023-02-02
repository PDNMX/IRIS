import { styled } from "@mui/material/styles";
import { Typography, Grid, Box, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";

//Componentes
import ResponsiveDateRangePicker from "../Componentes/ResponsiveDateRangePicker";

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

function Bandera3() {
  const [dataBarraContractId, setdataBarraContractId] = useState([]);
  const [dataBarraTotalAmount, setdataBarraTotalAmount] = useState([]);
  const [dataPie, setDataPie] = useState([]);
  const [dataLinea, setdataLinea] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("2001-03-07");
  const [fechaFin, setFechaFin] = useState("2019-10-25");
  const [numeroDeContratos, setNumeroDeContratos] = useState(0);
  const [montoTotal, setMontoTotal] = useState(0);

  useEffect(() => {
    getDataBarraTotalAmount();
    getDataBarraContractId();
    getDataPie();
    getdataLinea();
    getNumeroDeContratosAndMontoTotal(fechaInicio, fechaFin);
    // eslint-disable-next-line
  }, []);

  function getMontoTotal(fechaInicio, fechaFin) {
    var myHeaders = new Headers();

    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $match: {
          _initialDate: {
            $gte: fechaInicio,
            $lte: fechaFin,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$totalAmount",
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
      `${API}/dataset/analytic_contracts_summary/aggregate`,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => setMontoTotal(result[0].totalAmount))
      .catch((error) => console.log("error", error));
  }

  function getNumeroDeContratos(fechaInicio, fechaFin) {
    var myHeaders = new Headers();

    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $match: {
          _initialDate: {
            $gte: fechaInicio,
            $lte: fechaFin,
          },
        },
      },
      {
        $group: {
          _id: "$contractId",
        },
      },
      {
        $group: {
          _id: 1,
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
      `${API}/dataset/analytic_contracts_summary/aggregate`,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => setNumeroDeContratos(result[0].contractId))
      .catch((error) => console.log("error", error));
  }

  function getNumeroDeContratosAndMontoTotal(fechaInicio, fechaFin) {
    getNumeroDeContratos(fechaInicio, fechaFin);
    getMontoTotal(fechaInicio, fechaFin);
  }

  function getDataBarraContractId() {
    var myHeaders = new Headers();

    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $group: {
          _id: "$procurementMethod",
          totalAmount: {
            $sum: "$totalAmount",
          },
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
      `${API}/dataset/analytic_contracts_summary/aggregate`,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) =>
        setdataBarraContractId(
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

  function getDataBarraTotalAmount() {
    var myHeaders = new Headers();

    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $group: {
          _id: "$procurementMethod",
          totalAmount: {
            $sum: "$totalAmount",
          },
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
      `${API}/dataset/analytic_contracts_summary/aggregate`,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) =>
        setdataBarraTotalAmount(
          result.sort((o1, o2) => {
            if (o1.totalAmount < o2.totalAmount) {
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
          _id: "$procurementMethod",
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
      `${API}/dataset/analytic_contracts_summary/aggregate`,
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

  function getdataLinea(value = [0, 100]) {
    var myHeaders = new Headers();

    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify([
      {
        $group: {
          _id: {
            _datetime: {
              $year: "$_datetime",
            },
            procurementMethod: "$procurementMethod",
          },
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
        let tmp = [];
        let obj = {};
        //Separamos por año
        for (let i = 0; i < result.length; i++) {
          obj["id"] = result[i]._id.procurementMethod;
          obj["data"] = [
            { x: result[i]._id._datetime, y: result[i].contractId },
          ];
          tmp.push(obj);
          obj = {};
        }
        //Acomodamos
        for (let i = 0; i < tmp.length; i++) {
          for (let j = 1; j < result.length; j++) {
            if (tmp[i].id === tmp[j].id) {
              if (tmp[i].data[0].x !== tmp[j].data[0].x) {
                tmp[i].data.push(tmp[j].data[0]);
              }
            }
          }
        }

        // Quitamos los repetidos
        var hash = {};
        tmp = tmp.filter(function (current) {
          var exists = !hash[current.id];
          hash[current.id] = true;
          return exists;
        });

        // Ordenamos los valores
        for (let i = 0; i < tmp.length; i++) {
          tmp[i].data.sort((o1, o2) => {
            if (o1.x < o2.x) {
              return -1;
            }
            return 0;
          });
        }

        // Garantizamos que primero sea Directa
        tmp.sort((o1) => {
          if (o1.id === "Directa") {
            return -1;
          } else {
            return 1;
          }
        });

        // Actualizamos los datos
        setdataLinea(tmp);
      })
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
            <TextoBold variant="h5">Bandera 3</TextoBold>
            <Typography textAlign={"justify"}>
              Bajo porcentaje de licitaciones ganadas (adjudicadas) mediante
              procesos competitivos.
            </Typography>

            <TextoBold variant="h6">Fase</TextoBold>

            <Typography textAlign={"justify"}>Licitación.</Typography>

            <TextoBold variant="h6">¿Por qué es una bandera roja?</TextoBold>

            <Typography textAlign={"justify"}>
              Un mayor porcentaje total de ofertas adjudicadas a través de
              procesos competitivos puede indicar una mayor apertura en compra
              pública. El uso de procedimientos competitivos puede permitir que
              los licitantes potenciales tengan mayor acceso a los procesos de
              contratación pública y, por lo tanto, puede resultar en una mayor
              competencia der mercado.
            </Typography>

            <TextoBold variant="h6">Información que necesitamos</TextoBold>
            <ul>
              <li>ID del concurso</li>
              <li>Método de contratación</li>
              <li>Valor del concurso</li>
            </ul>
            <TextoBold variant="h6">¿Cómo se calcula?</TextoBold>
            <Typography textAlign={"justify"}>
              Número total de procesos de contratación adjudicados por métodos
              competitivos / número total de procesos de contratación.
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
              funcion={getNumeroDeContratosAndMontoTotal}
              fechaInicio={null}
              fechaFin={fechaFin}
              setFechaInicio={setFechaInicio}
            />
            <ResponsiveDateRangePicker
              titulo="Fecha de fin"
              fecha={fechaFin}
              funcion={getNumeroDeContratosAndMontoTotal}
              fechaInicio={fechaInicio}
              fechaFin={null}
              setFechaFin={setFechaFin}
            />
          </Box>
        </Box>
      </Grid>

      {/*Número de contratos*/}
      <Grid item xs={12} sm={12} md={6}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Número de contratos
            </Typography>
            <Typography variant="h5">
              {numeroDeContratos.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/*Monto total*/}
      <Grid item xs={12} sm={12} md={6}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Monto total
            </Typography>
            <Typography variant="h5">{montoTotal.toLocaleString()}</Typography>
          </Box>
        </Box>
      </Grid>

      {/*Grafica de lineas*/}
      <Grid item xs={12} sm={12} md={12}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Cantidad de contratos anuales por tipo (método) de adjudicación
            </Typography>
            <Line
              data={dataLinea}
              bottomLegend={"Año"}
              leftLegend={"Número de contratos"}
              leftLegendOffset={-55}
              scheme={"set2"}
              marginLeft={60}
            />
            <Typography paragraph textAlign={"justify"}>
              La gráfica muestra el número de procesos anuales de contratación,
              según el tipo de contratación: Directa, Selectiva, Abierta o NA
              (No Asignado).
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/*Grafica de Pie*/}
      <Grid item xs={12} sm={12} md={6}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Distribución de contratos por método de adjudicación (%)
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

      {/*Grafica de barras de contractId*/}
      <Grid item xs={12} sm={12} md={6}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Distribución de contratos por tipo de contratación
            </Typography>
            <Barra
              data={dataBarraContractId}
              keys={["contractId"]}
              indexBy={"_id"}
              bottomLegend={"Método de adjudicación"}
              leftLegend={"Número de contratos"}
              leftLegendOffset={-65}
              bottomTickRotation={0}
              scheme={"pink_yellowGreen"}
              id={"Número de contratos"}
              ml={70}
              groupMode={"stacked"}
            />
          </Box>
        </Box>
      </Grid>

      {/*Grafica de barras de totalAmount*/}
      <Grid item xs={12} sm={12} md={12}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ p: 2, border: "5px dashed silver" }}>
            <Typography paragraph textAlign={"justify"}>
              Distribución de contratos por monto
            </Typography>
            <Barra
              data={dataBarraTotalAmount}
              keys={["totalAmount"]}
              indexBy={"_id"}
              bottomLegend={"Método de adjudicación"}
              leftLegend={"Monto de los contratos"}
              leftLegendOffset={-100}
              bottomTickRotation={0}
              scheme={"pink_yellowGreen"}
              id={"Monto de los contratos"}
              ml={110}
              groupMode={"stacked"}
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

export default Bandera3;
