import React, { useState } from 'react';
import { useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";
import { mockGeographyData as data } from "../data/mockData";
import * as d3 from 'd3';

const GeographyChart = ({ isDashboard = false, redDotCoordinates }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to store the red dot coordinates
  const [currentRedDot, setCurrentRedDot] = useState(redDotCoordinates);

  // Projection function for converting geographical coordinates to pixel coordinates
  const projection = d3.geoMercator()
    .scale(isDashboard ? 40 : 150)
    .translate(isDashboard ? [0.5 * window.innerWidth, 0.5 * window.innerHeight] : [0.5 * window.innerWidth, 0.5 * window.innerHeight]);

  // Convert geographical coordinates to pixel coordinates
  const getRedDotPosition = (coordinates, projection) => {
    if (!coordinates) return { x: 52.2129919, y: 5.2793703 };
    const [longitude, latitude] = coordinates;
    const [x, y] = projection([longitude, latitude]);
    return { x, y };
  };

  // Update red dot coordinates if they change
  React.useEffect(() => {
    if (redDotCoordinates) {
      setCurrentRedDot(redDotCoordinates);
    }
  }, [redDotCoordinates]);

  const redDotPosition = getRedDotPosition(currentRedDot, projection);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ResponsiveChoropleth
        data={data}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
        }}
        features={geoFeatures.features}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        domain={[0, 1000000]}
        unknownColor="#666666"
        label="properties.name"
        valueFormat=".2s"
        projectionScale={isDashboard ? 40 : 150}
        projectionTranslation={isDashboard ? [0.5, 0.5] : [0.5, 0.5]}
        projectionRotation={[0, 0, 0]}
        borderWidth={1.5}
        borderColor="#ffffff"
        legends={
          !isDashboard
            ? [
              {
                anchor: "bottom-left",
                direction: "column",
                justify: true,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: colors.grey[100],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#ffffff",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
            : undefined
        }
        style={{ width: '100%', height: '100%' }}
      />
      {currentRedDot && (
        <svg
          width="100"
          height="100"
          style={{
            position: 'absolute',
            top: `${redDotPosition.y - 10}px`, // Adjusted to center the dot
            left: `${redDotPosition.x - 10}px`, // Adjusted to center the dot
            pointerEvents: 'none' // Prevent interference with map interactions
          }}
        >
          <circle cx="10" cy="10" r="10" fill="red" />
        </svg>
      )}
    </div>
  );
};

export default GeographyChart;
