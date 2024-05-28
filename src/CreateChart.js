import React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';

const Chart = () => {
  const theme = useTheme();

  const data = [
    { time: 'Day 1', amount: 100 },
    { time: 'Day 2', amount: 200 },
    { time: 'Day 3', amount: 150 },
    { time: 'Day 4', amount: 300 },
    { time: 'Day 5', amount: 250 },
    { time: 'Day 6', amount: 400 },
    { time: 'Day 7', amount: 350 },
  ];

  return (
    <div style={{ width: '100%', height: '300px' }}> {/* Set height here */}
    <LineChart
      dataset={data}
      margin={{
        top: 16,
        right: 20,
        left: 70,
        bottom: 30,
      }}
      xAxis={[
        {
          scaleType: 'point',
          dataKey: 'time',
          tickNumber: 2,
          tickLabelStyle: theme.typography.body2,
        },
      ]}
      yAxis={[
        {
          label: 'Sales ($)',
          labelStyle: {
            ...theme.typography.body1,
            fill: theme.palette.text.primary,
          },
          tickLabelStyle: theme.typography.body2,
          max: 500,
          tickNumber: 5,
        },
      ]}
      series={[
        {
          dataKey: 'amount',
          showMark: false,
          color: theme.palette.primary.light,
        },
      ]}
      sx={{
        [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
        [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
        [`& .${axisClasses.left} .${axisClasses.label}`]: {
          transform: 'translateX(-25px)',
        },
      }}
    />
  </div>
  );
}

export default Chart;
