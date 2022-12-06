import React from 'react';
import { ResponsiveBar } from "@nivo/bar";
import { BasicTooltip } from '@nivo/tooltip';

const Barra = (parametros) => {

const BarTooltip = (props) => {
  return (React.createElement(BasicTooltip, { id: parametros.id, value: props.value, color: props.color, enableChip: true }));
};
  return (
    <div style={{ height: "400px" }}>
      <ResponsiveBar
        data={parametros.data}
        keys={parametros.keys}
        indexBy={parametros.indexBy}
        margin={{ top: 50, right: 10, bottom: 50, left: parametros.ml }}
        padding={0.3}
        groupMode={parametros.groupMode}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: parametros.scheme }}
        colorBy="indexValue"
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        borderWidth={5}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: parametros.bottomTickRotation,
          legend: parametros.bottomLegend,
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: parametros.leftLegend,
          legendPosition: "middle",
          legendOffset: parametros.leftLegendOffset,
        }}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["brighter", 5]],
        }}
        legends={[]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        tooltip={BarTooltip}
      />
    </div>
  );
};

export default Barra;
