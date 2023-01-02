import { InputLabel, InputAdornment, Input, FormControl } from "@mui/material";

//Iconos
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Comando(Props) {
  function cargaComando(e) {
    Props.setComando(parseInt(e.target.value));

    if (Props.Label === "Rango inferior") {
      Props.actualiza(
        parseInt(e.target.value, 10),
        Props.rangoSuperior,
        Props.fechaInicio,
        Props.fechaFin
      );
    } else if (Props.Label === "Rango superior") {
      Props.actualiza(
        Props.rangoInferior,
        parseInt(e.target.value, 10),
        Props.fechaInicio,
        Props.fechaFin
      );
    }
  }
  return (
    <FormControl variant="standard" sx={{ padding: 2 }}>
      <InputLabel color={"secondary"} sx={{ color: "black" }}>
        {Props.Label}
      </InputLabel>
      <Input
        id="Editor"
        type={Props.type}
        color={"secondary"}
        value={Props.comando}
        onChange={cargaComando}
        startAdornment={
          <InputAdornment position="start">
            <ArrowForwardIcon />
          </InputAdornment>
        }
      />
    </FormControl>
  );
}
