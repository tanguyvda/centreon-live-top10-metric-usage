var options = {
  chart: {
    height: 30,
    type: 'bar',
    stacked: true,
    sparkline: {
      enabled: true
    },
    events: {}
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '100%',
      colors: {
        backgroundBarColors: ['#40475D']
      },
      dataLabels: {
        position: 'bottom',
        hideOverflowingLabels: false
      }
    }
  },
  tooltip: {
    enabled: false
  },
  yaxis: {
    max: 100
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      shadeIntensity: 0,
      inverseColors: false
    }
  },
  dataLabels: {
    enabled: true,
    textAnchor: 'start',
    style: {}
  },
  xaxis: {}
};
