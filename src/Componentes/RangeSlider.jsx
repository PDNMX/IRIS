import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return value;
}

export default function RangeSlider(Props) {
  const [value, setValue] = React.useState([0, 100]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange2 = (event, newValue) => {
    Props.peticion(newValue,Props.fechaInicio,Props.fechaFin)
  };

  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 100,
      label: "100",
    },
    {
      value: 200,
      label: "200",
    },
    {
      value: 300,
      label: "300",
    },
    {
      value: 400,
      label: "400",
    },
    {
      value: 500,
      label: "500",
    },
    {
      value: 600,
      label: "600",
    },
    {
      value: 700,
      label: "700",
    },
    {
      value: 800,
      label: "800",
    },
    {
      value: 900,
      label: "900",
    },
    {
      value: 1000,
      label: "1000",
    },
  ];

  return (
    <Box sx={{ ml: 2, mr: 2 }}>
      <Slider
        getAriaLabel={() => "Range"}
        value={value}
        onChange={handleChange}
        onChangeCommitted={handleChange2}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        style={{ color: Props.color }}
        step={1}
        marks={marks}
        min={Props.min}
        max={Props.max}
      />
    </Box>
  );
}
