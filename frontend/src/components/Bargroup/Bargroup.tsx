import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import drilldown from 'highcharts/modules/drilldown.js';
import { barOptions } from './options';
import { barGroupDrillDownMockData, barGroupMockData } from './mockData';

export type BarGroupProps = {
  width: null | number | string,
  height: null | number | string,
  title: string,
  yAxisTitle: string,
  seriesName: string,
  data: ({
      name: string;
      y: number;
      drilldown: string;
  } | {
      name: string;
      y: number;
      drilldown: null;
  })[],
  drilldownData: {
      name: string;
      id: string;
      data: (string | number)[][];
  }[]
};

export default function Bargroup({width, height, title, yAxisTitle, seriesName, data, drilldownData}: BarGroupProps) {
  drilldown(Highcharts);
  var options = barOptions({
    width: width, 
    height: height,
    title: title,
    yAxisTitle: yAxisTitle,
    seriesName: seriesName,
    data: data,
    drilldownData: drilldownData
  });
  return(
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
}