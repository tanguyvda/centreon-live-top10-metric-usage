/**
* Converts metrics units.
*
* @value {number} the metric value
* @unit {string} the unit of the metric
* @return {object} {value: value, unit: unit, converted: boolean}
*/
function convertUnit(value, unit) {

  var units = '';
  var calculus = '';
  var result = '';
  if (value !== 0) {
    if (unit === 'B') {
      units = [ 'B', 'KB', 'MB', 'TB'];
      calculus = Math.floor(Math.log(value) / Math.log(1024));
    } else if (unit === 'b/s') {
      value = value / 8;
      units = [ 'B/s', 'KB/s', 'MB/s', 'TB/s'];
      calculus = Math.floor(Math.log(widgetData[i].current_value) / Math.log(1024));
    };

    if (calculus !== '') {
      result = {
        value: (value / Math.pow(1024, calculus)).toFixed(2) * 1,
        unit: units[calculus],
        converted: true
      };
    } else {
      result = {
        value: value,
        unit: unit,
        converted: false
      };
    };
  } else {
    result = {
      value: value,
      unit: unit,
      converted: false
    };
  }

  return result;
}
