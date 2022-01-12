interface barOptionsProps {
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
}

export const barOptions = ({width, height, title, yAxisTitle, seriesName, data, drilldownData}:barOptionsProps) =>{ return {
    chart: {
        type: 'column',
        width: width,
        height: height
    },
    title: {
        text: title
    },
    subtitle: {
        text: 'Click the columns to view the details.'
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: yAxisTitle
        }

    },
    legend: {
        enabled: true
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b><br/>'
    },

    series: [
        {
            name: seriesName,
            colorByPoint: true,
            data: data
                   
        }
    ],
    drilldown: {
        series: drilldownData
    }
}}