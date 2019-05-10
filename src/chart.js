function loadGraph(widgetData, preferences, windowWidth) {

	var serieData = new Array();
	var categories = new Array();
	var hostName = new Array();
	var graphData = new Array();
	var standardWarningThreshold = widgetData[0].warning;
	var standardCriticalThreshold = widgetData[0].critical;
	var standardUnit = widgetData[0].unit;
	var height = preferences.height - 50;
	var width = windowWidth - 30;


	/*
	SERIE OPTIONS
	*/

	//building serie data
	for (i in widgetData) {

		//selecting color
		if (preferences.enable_status_color == "1") {
			if (widgetData[i].status == "2") {
				barColor = "#ed1c24";
			} else if (widgetData[i].status == "1") {
				barColor = "#ff9913";
			} else {
				barColor = "#87bd23";
			};
		} else {
			barColor = "#2E93fA";
		};

		serieData.push({'name':widgetData[i].host_name, 'y':widgetData[i].current_value, 'x':widgetData[i].host_name, 'fillColor': barColor});
		if (widgetData[0].unit == "B") {
			var calculus = Math.floor(Math.log(widgetData[i].current_value) / Math.log(1024));
	 	} else if (widgetData[0].unit == "b/s") {
	 		var calculus = Math.floor(Math.log(widgetData[i].current_value / 8) / Math.log(1024));
	 	}

		if (calculus != ""  && typeof(calculus) != "undefined") {
			units = [ 'B', 'KB', 'MB', 'TB'];
			var convertedValue = (widgetData[i].current_value / Math.pow(1024, calculus)).toFixed(2) * 1;
			var convertedUnit = units[calculus];
			categories.push(convertedValue + " " + convertedUnit);
		} else {
			categories.push(widgetData[i].current_value);
		}


		if (widgetData[i].warning != standardWarningThreshold) {
			var enableWarningThreshold = "0";
		}

		if (widgetData[i].critical != standardCriticalThreshold) {
			var enableCriticalThreshold = "0";
		}
	}

	/*
	CHART OPTIONS
	*/

	//animations
	if (preferences.enable_animations == "0") {
		var enableAnimations = false;
	} else {
		var enableAnimations = true;
	}

	if (preferences.animation_type == "") {
		var animationType = "easeinout";
	} else {
		var animationType = preferences.animation_type;
	}

	//toolbar
	if (preferences.enable_toolbar == "0") {
	        var enableToolbar = false;
	} else {
	        var enableToolbar = true;
	}

	/*
	PLOT OPTIONS
	*/

	/*
	*TITLES OPTIONS
	*/

	//title
	if (preferences.title_pos == "") {
		var titlePosition = "center";
	} else {
		var titlePosition = preferences.title_pos;
	}

	if (preferences.chart_title == "") {
	        var chartTitle = undefined;
	} else {
	        var chartTitle = preferences.chart_title;
	}


	//subtitle
	if (preferences.subtitle_pos == "") {
		var subtitlePosition = "center";
	} else {
		var subtitlePosition = preferences.subtitle_pos;
	}

	if (preferences.chart_subtitle == "") {
		var chartSubtitle = undefined;
	} else {
		var chartSubtitle = preferences.chart_subtitle;
	}

	/*
	LEGEND OPTIONS
	*/
	if (preferences.enable_legend == "0") {
		var enableLegend = false;
	} else {
		var enableLegend = true;
	}

	/*
	DATALABELS OPTIONS
	*/

	//enable datalabels
	if (preferences.display_host_name == "0") {
		var displayHostName = false;
	} else {
		var displayHostName = true;
	}

	//set datalabels position
	if (preferences.datalabels_pos == "") {
        var datalabelsPosition = "bottom";
		var datalabelsTextAnchor = "start";
	} else {
        var datalabelsPosition = preferences.datalabels_pos;
		if (preferences.datalabels_pos == "bottom") {
			var datalabelsTextAnchor = "start";
		} else if (preferences.datalabels_pos == "center") {
			var datalabelsTextAnchor = "middle";
		} else if (preferences.datalabels_pos == "top") {
			var datalabelsTextAnchor = "end";
		}
	}

	/*
	TOOLTIP OPTIONS
	*/
	if (preferences.enable_tooltip == "0") {
		var enableTooltip = false;
	} else {
		var enableTooltip = true;
	}

	/*
	ANNOTATIONS OPTIONS
	*/

	//annotations position
	if (preferences.annotations_pos == "") {
		var annotationsPosition = "bottom";
	} else {
		var annotationsPosition = preferences.annotations_pos;
	}

	//annotations style
	if (preferences.annotations_style == "" || preferences.annotations_style == "dashed") {
		var annotationsStyle = "5";
	} else {
		var annotationsStyle = "0";
	}

	//annotations label
	if (preferences.enable_annotations_label == "1") {
		var annotationsLabelWarning = "warning";
		var annotationsLabelCritical = "critical";
	} else {
		var annotationsLabelWarning = "";
		var annotationsLabelCritical = "";
	}

	/*
	AXIS OPTIONS
	*/

	//xaxis title
	if (standardUnit != "") {
		var xaxisTitle = preferences.service_description + " (" + standardUnit + ")";
	} else {
		var xaxisTitle = preferences.service_description;
	}


	/*
	BUILDING CHART OPTIONS
	*/
	var options = {
		chart: {
			height: preferences.height,
            type: 'bar',
			toolbar: {
				show: enableToolbar,
				tools: {
					download: true,
				},
			},
			animations: {
				enabled: enableAnimations,
				easing: animationType,
				animateGradually: {
					enabled: enableAnimations,
				},
				dynamicAnimation: {
					enabled: enableAnimations,
				},
			},
			width: width,
			height: height,
		},
		plotOptions: {
	    	bar: {
            	horizontal: true,
				dataLabels: {
					position: datalabelsPosition,
				}
            }
	    },
        dataLabels: {
            enabled: displayHostName,
			formatter: function(val, opt) {
                    return opt.w.globals.seriesX[0][opt.dataPointIndex];
                },
			textAnchor: datalabelsTextAnchor,
        },
		title: {
			text: chartTitle,
			align: titlePosition,
		},
		subtitle: {
			text: chartSubtitle,
			align: subtitlePosition,
		},
		legend: {
			show: enableLegend,
		},
		tooltip: {
			enabled: enableTooltip,
		},
        series: [{
			data: serieData,
		}],
		yaxis: {
		},
		xaxis: {
			categories: categories,
			labels: {
				show: true,
			},
		},
	}

	var chart = new ApexCharts(document.querySelector("#chart"), options);

	chart.render();

	if (preferences.enable_annotations == "1") {
		var annotationsXaxis = new Array();
		if (widgetData.warning != "" && enableWarningThreshold != "0" ) {
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

		if (widgetData.critical != "" && enableCriticalThreshold != "0") {
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

		chart.updateOptions({
		annotations: {
			xaxis: annotationsXaxis,
	        },
		}, enableAnimations, enableAnimations);
	};
}
