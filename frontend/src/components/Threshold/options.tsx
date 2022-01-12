import Highcharts from "highcharts";

interface lineOptionsProps {
    width: null | number | string,
    height: null | number | string,
    title: string,
    yAxisTitle: string,
    seriesName: string,
    data: number[][],
    seriesType: 'linear' | 'datetime'
}

export const lineOptions = ({width, height, title, yAxisTitle, seriesName, data, seriesType}:lineOptionsProps) => { return {
    chart: {
        zoomType: 'x',
        width,
        height
    },
    title: {
        text: title
    },
    subtitle: {
        text: document.ontouchstart === undefined ?
            'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
    },
    xAxis: {
        type: seriesType
    },
    yAxis: {
        title: {
            text: yAxisTitle
        }
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        area: {
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, 'lightblue'],
                    [1, Highcharts.color('lightblue').setOpacity(0).get('rgba')]
                ]
            },
            marker: {
                radius: 2
            },
            lineWidth: 1,
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            threshold: null
        }
    },

    series: [{
        type: 'area',
        name: seriesName,
        data: data
    }]
}}