import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return value;
}

export default function RangeSlider(Props) {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    getMarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event, newValue) => {
    Props.setValue(newValue);
    getMarks();
  };

  const handleChange2 = (event, newValue) => {
    Props.peticion(newValue, Props.fechaInicio, Props.fechaFin);
  };

  function getMarks() {
    var tmpMarks = [];
    for (let i = 0; i < Props.max; i++) {
      if (i % Props.mod === 0) {
        var tmp = {};
        tmp["value"] = i;
        tmp["label"] = i;
        tmpMarks.push(tmp);
      }
    }
    setMarks(tmpMarks);
  }

  return (
    <Box sx={{ ml: 2, mr: 2 }}>
      <Slider
        getAriaLabel={() => "Range"}
        value={Props.value}
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
