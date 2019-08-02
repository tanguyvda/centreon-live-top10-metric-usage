let serieData = new Array();
let hostName = new Array();
let graphData = new Array();
let convertedData = new Array();
let standardWarningThreshold = widgetData[0].warning;
let standardCriticalThreshold = widgetData[0].critical;
let standardUnit = widgetData[0].unit;
let height = preferences.height - 50;
let width = windowWidth - 30;
let rowCount = '';
let chartHeight = widgetData.rowCount * 30;
let autoRefresh = preferences.autoRefresh;
let timeout;

/*
PREFERENCES OPTIONS
*/
let enableAnimations = false;
let animationType = 'easeinout';
let enableToolbar = false;
let titlePosition = 'center';
let chartTitle = undefined;
let subtitlePosition = 'center';
let chartSubtitle = undefined;
let displayHostName = false;
let enableTooltip = false;
let annotationsPosition = 'bottom';
let annotationsStyle = 5;
let annotationsLabelWarning = 'warning';
let annotationsLabelCritical = 'critical';
let xaxisTitle = preferences.service_description;
let categories;
let displayGrid = false
let annotationsXaxis = new Array();
let enableThreshold = {
  critical: 0,
  warning: 0
};

/*
CHART DESIGN OPTIONS
*/
let chartDesign = {
  colors: {
    critical: '#f4767b',
    warning: '#ffc170',
    ok: '#b7d77a',
    unknown: '#dcdcdc',
    default: '#65bcfd',
    text: ['#aeaeae']
  },
  fontFamily: {
    default: 'Roboto Regular',
    bold: 'Roboto Bold',
    light: 'Roboto Light',
    medium: 'Roboto Medium'
  },
  fontSize: {
    dataLabels: '10px',
    xAxis: '20px',
    default: '10px'
  },
  css: {
    xAxis: 'xAxisCSS',
    yAxis: 'yAxisCSS'
  }
}
let barColor = '';

function sleep() {
  return new Promise(resolve => setTimeout(resolve, autoRefresh * 1000));
}

function updateChartData(chart) {
  jQuery.ajax({
    url: './index.php',
    type: 'GET',
    data: {
      widgetId: widgetId,
      refreshChart: true,
    },
    success: function(widgetData) {
      try {
        serieData = buildSerieData(widgetData);
        parent.iResize(window.name, widgetData.rowCount * 30);
        chart.updateSeries(serieData);
        chart.updateOptions({
          xaxis: {
            categories: categories
          }
        })
        sleep().then(() => {
          updateChartData(chart)
        });
      }
      catch(error) {
        console.error('Error while updating the serie: ' + error);
      }
    }
  })
}

/*
SERIE OPTIONS
*/
function setSerieColor(widgetData, i) {
  if (widgetData[i].status === '2') {
    barColor = chartDesign.colors.critical;
  } else if (widgetData[i].status === '1') {
    barColor = chartDesign.colors.warning;
  } else if (widgetData[i].status === '0') {
    barColor = chartDesign.colors.ok;
  } else {
    barColor = chartDesign.colors.unknown;
  }

  return barColor;
}

//building serie data
function buildSerieData(widgetData) {
  console.log('widgetdata: ')
  console.log(widgetData);
  rowCount = widgetData.rowCount;
  categories = [];
  serieData = [];
  for (var i = 0; i < rowCount; i++) {
    //set serie color
    if (preferences.enable_status_color === '1') {
      try {
        setSerieColor(widgetData, i);
      } catch (error) {
        console.error("Couldn't set serie color: " + error);
      }
    }

    //build axis labels with converted unit if needed
    try {
      convertedData.push(convertUnit(widgetData[i].current_value, widgetData[i].unit));
      categories.push(widgetData[i].host_name);
    } catch (error) {
      console.error("Failed to handle data unit: " + error);
    }

    //check if using annotations to display threshold is possible
    try {
      checkSerieThreshold(i);
    } catch (error) {
      console.error("Failed to check annotations possibilities: " + error)
    }

    //set serie data
    serieData[i] = {
      'name': widgetData[i].host_name,
      'data': [{
        'y': widgetData[i].current_value,
        'x': widgetData[i].host_name,
        'fillColor': barColor,
      }]
    };
  }

  return serieData;
}

function checkSerieThreshold(i) {
  //if one of the metric doesn't have the same threshold than the others, then we disable annotations
  if (widgetData[i].warning === standardWarningThreshold && widgetData[i].warning !== null && widgetData[i].warning !== undefined) {
    enableThreshold.warning = 1;
  }
  if (widgetData[i].critical === standardCriticalThreshold && widgetData[i].critical !== null && widgetData[i].critical !== undefined) {
    enableThreshold.critical = 1;
  }

  return enableThreshold;
}

function buildChartOption() {
  console.log('preferences: ');
  console.log(preferences);
  //animations
  enableAnimations = (preferences.enable_animations === '0') ? enableAnimations : true;
  animationType = (preferences.animation_type === '') ? animationType : preferences.animation_type;

  //toolbar
  enableToolbar = (preferences.enable_toolbar === '0') ? enableToolbar : true;

  //title
  titlePosition = (preferences.title_pos === '') ? titlePosition : preferences.title_pos;
  chartTitle = (preferences.chart_title === '') ? chartTitle : preferences.chart_title;

  //subtitle
  subtitlePosition = (preferences.subtitle_pos === '') ? subtitlePosition : preferences.subtitle_pos;
  chartSubtitle = (preferences.chart_subtitle === '') ? chartSubtitle : preferences.chart_subtitle;

  //enable datalabels
  displayHostName = (preferences.display_host_name === '0') ? displayHostName : true;

  //set datalabels position
  if (preferences.datalabels_pos === '') {
    var datalabelsPosition = 'bottom';
    var datalabelsTextAnchor = 'start';
  } else {
    var datalabelsPosition = preferences.datalabels_pos;
    if (preferences.datalabels_pos === 'bottom') {
      var datalabelsTextAnchor = 'start';
    } else if (preferences.datalabels_pos === 'center') {
      var datalabelsTextAnchor = 'middle';
    } else if (preferences.datalabels_pos === 'top') {
      var datalabelsTextAnchor = 'end';
    }
  }

  //enable tooltip
  enableTooltip = (preferences.enable_tooltip === '0') ? enableTooltip : true;

  //annotations position
  annotationsPosition = (preferences.annotations_pos === '')
  ? annotationsPosition
  : preferences.annotations_pos;

  //annotations style
  annotationsStyle = (preferences.annotations_style === '' || preferences.annotations_style === 'dashed')
  ? annotationsStyle
  : annotationsStyle = 0;

  //annotations label
  annotationsLabelWarning = (preferences.enable_annotations_label === '1')
  ? annotationsLabelWarning
  : annotationsLabelWarning = '';

  annotationsLabelCritical = (preferences.enable_annotations_label === '1')
  ? annotationsLabelCritical
  : annotationsLabelCritical = '';

  //grid display
  displayGrid = (preferences.display_grid === '0') ? displayGrid : true;

  /*
  BUILDING CHART OPTIONS
  */
  options.series = serieData;

  //chart options
  options.chart.height = chartHeight;
  options.chart.width = width;
  options.chart.toolbar.show = enableToolbar;
  options.chart.toolbar.tools.download = true;
  options.chart.animations.enabled = enableAnimations;
  options.chart.animations.easing = animationType;
  options.chart.animations.animateGradually.enabled = enableAnimations;
  options.chart.animations.dynamicAnimation.enabled = enableAnimations;
  options.chart.events.dataPointSelection = function(event, chartContext, config) {
    window.open(window.location.origin + '/centreon/main.php?p=20401&mode=0&svc_id='
    + widgetData[config.seriesIndex].host_name + ';'
    + widgetData[config.seriesIndex].service_description);
  }

  //plot options
  // options.plotOptions.bar.dataLabels.position = datalabelsPosition;

  //dataLabels options
  // options.dataLabels.formatter = function (val, opts) {
  //   if (convertedData[opts.seriesIndex].converted === true) {
  //       return convertedData[opts.seriesIndex].value + ' ' + convertedData[opts.seriesIndex].unit;
  //   } else {
  //     return val + ' ' + convertedData[opts.seriesIndex].unit;
  //   }
  // };
  options.dataLabels.enabled = false;
  // options.dataLabels.textAnchor = datalabelsTextAnchor;
  // options.dataLabels.style.fontFamily = chartDesign.fontFamily.default;
  // options.dataLabels.style.fontSize = chartDesign.fontSize.dataLabels;
  // options.dataLabels.style.colors = chartDesign.colors.text;

  //title options
  options.title.text = chartTitle;
  options.title.align = titlePosition;
  options.subtitle.text = chartSubtitle;
  options.subtitle.align = subtitlePosition;

  //tooltip options
  options.tooltip.enabled = enableTooltip;
  options.tooltip.style.fontFamily = chartDesign.fontFamily.default;
  options.tooltip.y.formatter = function(value, {series, seriesIndex, dataPointIndex, w}) {
    return (widgetData[0].unit !== '')
    ? series[seriesIndex] + widgetData[0].unit
    : series[seriesIndex];
  };

  //axis options
  options.yaxis.labels.style.cssClass = chartDesign.css.yAxis;
  options.yaxis.labels.style.fontFamily = chartDesign.fontFamily.default;
  // options.yaxis.labels.formatter = function(val, index) {
  //   console.log(val);
  // }

  options.xaxis.categories = categories;
  options.xaxis.title.text = xaxisTitle;
  options.xaxis.title.style.fontSize = chartDesign.fontSize.xAxis;
  options.xaxis.title.style.fontFamily = chartDesign.fontFamily.default;
  options.xaxis.title.style.cssClass = chartDesign.css.xAxis;
  options.xaxis.labels.formatter = function(value){
    let convertedChartLabel = convertUnit(value, widgetData[0].unit)
    return convertedChartLabel.value + convertedChartLabel.unit;
  }
  options.xaxis.labels.show = true;

  //annotations
  if (preferences.enable_annotations === '1') {
    buildChartAnnotations();
  }

  //grid options
  options.grid.xaxis.lines.show = displayGrid;
  options.grid.yaxis.lines.show = true;

  console.log('options');
  console.log(options);
  return options;
}

function buildChartAnnotations() {
  console.log('threshold: ');
  console.log(enableThreshold);
  if (enableThreshold.warning === 1) {
    annotationsXaxis.push({
      x: standardWarningThreshold,
      strokeDashArray: annotationsStyle,
      borderColor: "#FEB019",
      label: {
        borderColor: "#FEB019",
        style: {
          color: "#fff",
          background: "#FEB019",
        },
        orientation: "vertical",
        text: annotationsLabelWarning,
        position: annotationsPosition,
      }
    });
  }

  if (enableThreshold.critical === 1) {
    annotationsXaxis.push({
      x: standardCriticalThreshold,
      strokeDashArray: annotationsStyle,
      borderColor: "#FF4560",
      label: {
        borderColor: "#FF4560",
        style: {
          color: "#fff",
          background: "#FF4560",
        },
        orientation: "vertical",
        text: annotationsLabelCritical,
        position: annotationsPosition,
      },
    });
  }
  if (annotationsXaxis != "") {
    options.annotations = {xaxis: annotationsXaxis}
  }
}

function renderChart() {
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
  return chart;
}

try {
  buildSerieData(widgetData);
}
catch(error) {
  console.error('Error while building serie data: ' + error);
}

try {
  buildChartOption();
}
catch(error) {
  console.error('Error while building chart options: ' + error);
}

try {
  parent.iResize(window.name, rowCount * 40 + 100);
  chart = renderChart();
}
catch(error) {
  console.error('Error while rendering chart: ' + error);
}

sleep().then(() => {
  updateChartData(chart)
});
