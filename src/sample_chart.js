var options = {
  chart: {
    type: 'bar',
    toolbar: {
      tools: {
        download: true,
      },
    },
    sparkline: {
      enabled: false,
    },
    animations: {
      animateGradually: {
      },
      dynamicAnimation: {
      },
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '100%',
      distributed: true,
      dataLabels: {
      },
    },
  },
  dataLabels: {
    style: {
      fontFamily: "sourcesans",
      fontSize: '20px',
      colors: [ '#232f39'],
    },
    dropShadow: {
      enabled: false,
    },
  },
  legend: {
    show: false,
  },
  title: {
  },
  subtitle: {
  },
  tooltip: {
    followCursor: true,
    style: {
      fontFamily: "sourcesans",
    },
    onDataSetHover: {
      highLightDataSeries: true,
    },
    y: {
      title: {
        formatter: function(w) {
          return '';
        },
      },
    },
    x: {
    },
    marker: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      style: {
        cssClass: 'yAxisCSS',
        fontFamily: 'sourcesans',
      },
    },
  },
  xaxis: {
    labels: {
      show: false,
    },
    title: {
      style: {
        fontSize: '20px',
        fontFamily: 'sourcesans',
        cssClass: 'xAxisCSS',
      },
    },
  },
  stroke: {
  },
  grid: {
    yaxis: {
      lines: {
        show: false,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
}
