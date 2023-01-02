import { ResponsivePie } from "@nivo/pie";

const Pie = (parametros) => {
  return (
    <div style={{ height: "400px" }}>
      <ResponsivePie
        data={parametros.data}
        id={parametros.id}
        value={parametros.value}
        margin={{ top: 40, right: -20, bottom: 60, left: 80 }}
        innerRadius={0.5}
        padAngle={6}
        cornerRadius={10}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "pink_yellowGreen" }}
        borderWidth={5}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsStraightLength={0}
        enableArcLabels={false}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["brighter", 2]],
        }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        legends={[
          {
            anchor: "bottom",
            direction: "column",
            justify: false,
            translateX: -220,
            translateY: parametros.translateY,
            itemsSpacing: 5,
            itemWidth: 250,
            itemHeight: 20,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default Pie;
