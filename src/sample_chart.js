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
    events: {
      dataPointSelection: {
      }
    }
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
      show: true,
    },
  },
  yaxis: {
    labels: {
      style: {
      },
    },
    axisTick: {
      show: true,
      borderType: 'solid',
      height: 6,
    }
  },
  xaxis: {
    labels: {
      show: false,
    },
    title: {
      style: {
      },
    },
  },
  stroke: {
  },
  grid: {
    position: 'front',
    yaxis: {
      lines: {
      },
    },
    xaxis: {
      lines: {
      },
    },
  },
  stroke: {
                show: true,
                width: 1,
                colors: ['#fff']
            },
}
