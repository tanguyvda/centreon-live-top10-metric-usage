function updateChartData () {
  jQuery.ajax({
    url: './index.php',
    type: 'GET',
    data: {
      widgetId: widgetId,
      refreshChart: true
    },
    success: function (widgetData) {
      try {
        widgetChart.buildSerieData(false, widgetData);
        parent.iResize(window.name, (parseFloat(widgetData.rowCount) + 3) * 30);
        console.log('refresh : ' + preferences.autoRefresh);
        sleep().then(() => {
          updateChartData();
        });
      } catch (error) {
        console.error('Error while updating the serie: ' + error);
      }
    }
  });
}

function sleep () {
  return new Promise(resolve => setTimeout(resolve, preferences.autoRefresh * 1000));
}

parent.iResize(window.name, (parseFloat(widgetData.rowCount) + 3) * 30);
let widgetChart = new LiveMetric(options, preferences, widgetData);
let createChart = widgetChart.buildSerieData(true);

if (createChart !== undefined) {
  sleep().then(() => {
    updateChartData();
  });
}
