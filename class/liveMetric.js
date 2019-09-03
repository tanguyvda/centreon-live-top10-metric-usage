/**
* widget data class is responsible of operations on datas.
* @options {object} chart sample options
* @preferences {object} widget preferences
* @widgetData {object} data that is going to be displayed
*/
class LiveMetric {
  constructor (options, preferences, widgetData) {
    this.oldDataLabelsOffsetX = [];
    this.chart = [];
    this.options = options;
    this.preferences = preferences;
    this.widgetData = widgetData;
    this.chartDesign = {
      colors: {
        bar: {
          okStart: '#b7d77a',
          okEnd: '#99c744',
          warningStart: '#ffc170',
          warningEnd: '#ffa836',
          criticalStart: '#f4767b',
          criticalEnd: '#f03e45',
          unknwonStart: '#dcdcdc',
          unknownEnd: '#cdcdcd',
          defaultStart: '#dcdcdc',
          defaultEnd: '#26a0fc'
        },
        text: ['#aeaeae']
      },
      fontFamily: {
        default: 'Roboto Regular',
        bold: 'Roboto Bold',
        light: 'Roboto Light',
        medium: 'Roboto Medium'
      },
      fontSize: {
        dataLabels: '15px',
        xAxis: '20px',
        default: '10px'
      },
      css: {
        xAxis: 'xAxisCSS',
        yAxis: 'yAxisCSS'
      }
    };
  }

  /**
  * Converts numerical data to human readable data.
  * @memberof LiveMetric
  * @data {object} contains metric related information
  * @return {object} contains converted data and old data
  */
  _convertUnit (data) {
    let value = data.currentValue;
    let units;
    let calculus;
    let result = {
      value: value,
      unit: data.unit,
      convertedValue: value,
      convertedUnit: data.unit
    };

    if (value !== 0) {
      switch (data.unit) {
        case 'B' :
          units = ['B', 'KB', 'MB', 'GB', 'TB'];
          break;
        case 'b/s' :
          value = value / 8;
          units = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
          break;
      }

      if (units !== '' && units !== undefined) {
        calculus = Math.floor(Math.log(value) / Math.log(1024));
        result.convertedValue = (value / Math.pow(1024, calculus)).toFixed(2) * 1;
        result.convertedUnit = units[calculus];
      }
    }
    return result;
  }

  /**
  * Converts values and max to percentages
  * @memberof LiveMetric
  * @chartsMax {number} value of the first metric
  * @data {object} contains metric related information
  * @return {float} percentage of the found maximum value
  */
  _getCurrentValueAsPercentage (chartsMax, data) {
    let value = parseFloat(data.currentValue);
    let max = data.max;
    let currentPercentage;
    // this is a bandaid patch, waiting for apex fix
    // https://github.com/apexcharts/apexcharts.js/issues/837
    if (max !== '' && max !== undefined && max !== null) {
      currentPercentage = value / max * 100;
    } else {
      currentPercentage = value / chartsMax * 100;
    }

    return currentPercentage;
  }

  /**
  * Converts numerical data to human readable data.
  * @memberof LiveMetric
  * @colors {object} contains colors data
  * @status {string} status code of the service
  * @return {object} contains start and end colors for the bar
  */
  _setSerieColor (colors, status) {
    let barColor = {
      startColor: colors.defaultStart,
      endColor: colors.defaultEnd
    };
    switch (status) {
      case '0' :
        barColor.startColor = colors.okStart;
        barColor.endColor = colors.okEnd;
        break;
      case '1' :
        barColor.startColor = colors.warningStart;
        barColor.endColor = colors.warningEnd;
        break;
      case '2' :
        barColor.startColor = colors.criticalStart;
        barColor.endColor = colors.criticalEnd;
        break;
    }
    return barColor;
  }

  /**
  * Fixes the dataLabels X position
  * @memberof LiveMetric
  * @currentPercentage {float} the current percentage of the max value
  * @i {integer} counter
  * @return {float} x offset value
  */
  _getDataLabelsOffsetX (currentPercentage, i) {
    // those const are coming from the x value of the SVG
    const maxReachedOffsetX = 13.100000000000023;
    const maxNotReachedOffsetX = 73.10000000000002;
    let offsetX;

    // creation of the chart, no offset has been defined
    if (this.oldDataLabelsOffsetX[i] === undefined) {
      offsetX = (currentPercentage !== 100) ? maxReachedOffsetX - maxNotReachedOffsetX : 0;
    } else {
      // there was no offset because currentPercentage value was 100 and it is still 100
      if (this.oldDataLabelsOffsetX[i] === 0 && currentPercentage === 100) {
        offsetX = 0;
      } else {
        // currentPercentage value has reached 100, we need to fix the offset,
        // or currentPercentage was 100 and is now lower, we need to fix the offset
        offsetX = maxReachedOffsetX - maxNotReachedOffsetX;
      }
    }

    return offsetX;
  }

  /**
  * builds the serie and everything that revolves around it in order to create our charts
  * @memberof LiveMetric
  * @initiateChart {bool} is this the first time we create the chart
  * @widgetData {object} data that is going to be displayed (used when chart is refreshed through ajax)
  * @return {object} chart
  */
  buildSerieData (initiateChart, widgetData = '') {
    let barColor;
    let currentPercentage;
    let serieData;
    if (widgetData !== '') {
      this.widgetData = widgetData;
    }

    for (let i = 0; i < this.widgetData.rowCount; i++) {
      if (this.preferences.enable_status_color === '1') {
        barColor = this._setSerieColor(this.chartDesign.colors.bar, this.widgetData[i].status);
      } else {
        barColor = {
          startColor: '#65bcfd',
          endColor: this.chartDesign.colors.default
        };
      }

      serieData = this._convertUnit(this.widgetData[i]);
      currentPercentage = this._getCurrentValueAsPercentage(this.widgetData[0].currentValue,
        this.widgetData[i]);

      if (initiateChart === true) {
        this.options.series = [{
          name: this.widgetData[i].host_name,
          data: [currentPercentage]
        }];
        this._buildChartOption(i, barColor, serieData, currentPercentage);
        this._renderChart(i);
      } else if (initiateChart === false) {
        this.chart[i].updateSeries([{
          data: [currentPercentage]
        }]);
        this._updateDynamicOption(i, barColor, serieData, currentPercentage);
      }
    }
    return this.chart;
  }

  /**
  * initiate the chart options
  * @memberof LiveMetric
  * @i {integer} counter
  * @barColor {object} contains all the color information we need
  * @serieData {object} contains the serie for the chart
  * @currentPercentage {float} the current percentage of the max value
  */
  _buildChartOption (i, barColor, serieData, currentPercentage) {
    let hostName = this.widgetData[i].host_name;
    let serviceDescription = this.widgetData[i].serviceDescription;
    this.options.colors = [barColor.endColor];
    this.options.fill.gradient.gradientToColors = [barColor.startColor];
    this.options.dataLabels.formatter = function () {
      return hostName + ':  ' + serieData.convertedValue + ' ' + serieData.convertedUnit;
    };
    console.log(currentPercentage);
    this.options.dataLabels.offsetX = this._getDataLabelsOffsetX(currentPercentage, i);
    this.options.dataLabels.style.fontFamily = this.chartDesign.fontFamily.bold;
    this.options.dataLabels.style.fontSize = this.chartDesign.fontSize.dataLabels;
    this.options.xaxis.categories = [this.widgetData[i].host_name];
    this.options.chart.width = '100%';
    // this.options.chart.events.dataPointSelection = function (event, chartContext, config) {
    //   window.open(window.location.origin + '/centreon/main.php?p=20401&mode=0&svc_id=' +
    //   hostName + ';' + serviceDescription);
    // };

    this.oldDataLabelsOffsetX[i] = this.options.dataLabels.offsetX;
  }

  /**
  * update the chart options
  * @memberof LiveMetric
  * @i {integer} counter
  * @barColor {object} contains all the color information we need
  * @serieData {object} contains the serie for the chart
  * @currentPercentage {float} the current percentage of the max value
  */
  _updateDynamicOption (i, barColor, serieData, currentPercentage) {
    let hostName = this.widgetData[i].host_name;
    let serviceDescription = this.widgetData[i].serviceDescription;
    let offsetX = this._getDataLabelsOffsetX(currentPercentage, i);
    this.chart[i].updateOptions({
      dataLabels: {
        formatter: function () {
          return hostName + ':  ' + serieData.convertedValue + ' ' + serieData.convertedUnit;
        },
        offsetX: offsetX
      },
      colors: [barColor.endColor],
      fill: {
        gradient: {
          gradientToColors: [barColor.startColor]
        }
      },
      xaxis: {
        categories: [hostName]
      },
      // chart: {
      //   events: {
      //     dataPointSelection: function (event, chartContext, config) {
      //       window.open(window.location.origin + '/centreon/main.php?p=20401&mode=0&svc_id=' +
      //       hostName + ';' + serviceDescription);
      //     }
      //   }
      // }
    });

    this.oldDataLabelsOffsetX[i] = offsetX;
  }

  /**
  * render the charts
  * @memberof LiveMetric
  * @i {integer} counter
  */
  _renderChart (i) {
    this.chart[i] = new ApexCharts(document.querySelector('#chart-' + i), this.options);
    this.chart[i].render();
  }
}
