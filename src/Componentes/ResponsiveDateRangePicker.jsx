import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";

export default function ResponsiveDatePickers(Props) {
  const [value, setValue] = useState(Props.fecha);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack sx={{ padding: 1 }}>
        <DatePicker
          disableFuture
          inputFormat="YYYY-MM-DD"
          label={Props.titulo}
          openTo="year"
          views={["year", "month", "day"]}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            var fecha = new Date(newValue);
            if (Props.fechaInicio == null) {
              Props.funcion(fecha, Props.fechaFin);
              Props.setFechaInicio(fecha);
            } else if (Props.fechaFin == null) {
              Props.funcion(Props.fechaInicio, fecha);
              Props.setFechaFin(fecha);
            }
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}
