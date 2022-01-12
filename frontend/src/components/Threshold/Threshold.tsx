import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import { thresholdMockData } from './mockData';
import { lineOptions } from './options';



export type ThresholdProps = {
  width: null | number | string,
  height: null | number | string,
  title: string,
  yAxisTitle: string,
  seriesName: string,
  data: number[][],
  seriesType: 'linear'|'datetime',
};

export default function ThresholdGraph({width, height,title, yAxisTitle, seriesName, data, seriesType}: ThresholdProps) {
    let options = lineOptions({
      width: width, 
      height: height,
      title: title,
      yAxisTitle: yAxisTitle,
      seriesName: seriesName,
      data: data,
      seriesType: seriesType,
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