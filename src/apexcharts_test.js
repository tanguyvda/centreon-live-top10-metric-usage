function load_graph_apex(widget_data, preferences, widget_width) {

var serie_data = new Array();
var host_name = new Array();
var graph_data = new Array();
var standard_wthreshold = widget_data[0].warning;
var standard_cthreshold = widget_data[0].critical;
var standard_unit = widget_data[0].unit;
console.log(preferences);
var height = preferences.height - 20;
var width = widget_width - 20;

/*
SERIE OPTIONS
*/

//building serie data
for (i in widget_data) {

	//selecting color
	if (preferences.enable_status_color == "1") {
		if (widget_data[i].status == "2") {
        	        bar_color = "#ed1c24";
	        } else if (widget_data[i].status == "1") {
			bar_color = "#ff9913";
		} else {
			bar_color = "#87bd23";
		};
	} else {
		bar_color = "#2E93fA";
	};

	serie_data.push({'name':widget_data[i].host_name, 'y':widget_data[i].current_value, 'x':widget_data[i].host_name, 'fillColor': bar_color});//, 'colors':bar_color});
	host_name.push(widget_data[i].host_name);
	
	if (widget_data[i].warning != standard_wthreshold) {
		var enable_wthreshold = "0";
	}

	if (widget_data[i].critical != standard_cthreshold) {
		var enable_cthreshold = "0";
	}
}

/*
SERIE OPTIONS
*/
/*
CHART OPTIONS
*/

//animations
if (preferences.enable_animations == "0") {
	var enable_animations = false;
} else {
	var enable_animations = true;
}

if (preferences.animation_type == "") {
	var animation_type = "easeinout";
} else {
	var animation_type = preferences.animation_type;
}

//toolbar
if (preferences.enable_toolbar == "0") {
        var enable_toolbar = false;
} else {
        var enable_toolbar = true;
}

/*
PLOT OPTIONS
*/

/*
*TITLES OPTIONS
*/

//title
if (preferences.title_pos == "") {
	var title_pos = "center";
} else {
	var title_pos = preferences.title_pos;
}

if (preferences.chart_title == "") {
        var chart_title = undefined;
} else {
        var chart_title = preferences.chart_title;
}


//subtitle
if (preferences.subtitle_pos == "") {
	var subtitle_pos = "center";
} else { 
	var subtitle_pos = preferences.subtitle_pos;
}

if (preferences.chart_subtitle == "") {
	var chart_subtitle = undefined;
} else { 
	var chart_subtitle = preferences.chart_subtitle;
}

/*
LEGEND OPTIONS
*/
if (preferences.enable_legend == "0") {
	var enable_legend = false;
} else {
	var enable_legend = true;
}

/*
DATALABELS OPTIONS
*/
if (preferences.display_metric_value == "0") {
	var display_metric_value = false;
} else {
	var display_metric_value = true;
}

if (preferences.datalabels_pos == "") {
        var datalabels_pos = "middle";
} else {
        var datalabels_pos = preferences.datalabels_pos;
}

/*
TOOLTIP OPTIONS
*/
if (preferences.enable_tooltip == "0") {
	var enable_tooltip = false;
} else {
	var enable_tooltip = true;
}

/*
ANNOTATIONS OPTIONS
*/

//annotations position
if (preferences.annotations_pos == "") {
	var annotations_pos = "bottom";
} else {
	var annotations_pos = preferences.annotations_pos;
}

//annotations style
if (preferences.annotations_style == "" || preferences.annotations_style == "dashed") {
	var annotations_style = "5";
} else {
	var annotations_style = "0";
}

//annotations label
if (preferences.enable_annotations_label == "1") {
	var annotations_label_warning = "warning";
	var annotations_label_critical = "critical";
} else {
	var annotations_label_warning = "";
	var annotations_label_critical = "";
}

/*
AXIS OPTIONS
*/

//xaxis title
if (standard_unit != "") {
	var xaxis_title = preferences.service_description + " (" + standard_unit + ")";
} else {
	var xaxis_title = preferences.service_description;
}

var options = {
	chart: {
		height: preferences.height,
                type: 'bar',
		toolbar: {
			show: enable_toolbar,
			tools: {
				download: true,
			},
		},
		animations: {
			enabled: enable_animations,
			easing: animation_type,
			animateGradually: {
				enabled: enable_animations,
			},
			dynamicAnimation: {
				enabled: enable_animations,
			},
		},
		
		width: width,
		height: height,
            },
	plotOptions: {
        	bar: {
                	horizontal: true,
                }
            },
        dataLabels: {
                enabled: display_metric_value,
                textAnchor: datalabels_pos,
        },
	title: {
		text: chart_title,
		align: title_pos,
	},
	subtitle: {
		text: chart_subtitle,
		align: subtitle_pos
	},
	legend: {
		show: enable_legend,
	},
	tooltip: {
		enabled: enable_tooltip,
	},
        series: [{
		data:serie_data,
	}],
	yaxis: {
		title: {
			text: 'Hosts',
		}
	},
	xaxis: {
		title: {
			text: xaxis_title,
		},
	},
}

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();

if (preferences.enable_annotations == "1") {
	var annotations_xaxis = new Array();
	if (widget_data.warning != "" && enable_wthreshold != "0" ) {
		annotations_xaxis.push({
                        x: standard_wthreshold,
                        strokeDashArray: annotations_style,
                        borderColor: "#FEB019",
					opacity: 0.4,
                        label: {
                                borderColor: "#FEB019",
                                style: {
                                        color: "#fff",
                                        background: "#FEB019",
                                },
                                orientation: "vertical",
                                text: annotations_label_warning,
                                position: annotations_pos,
       			}
		});
	}
	
	if (widget_data.critical != "" && enable_cthreshold != "0") {
		annotations_xaxis.push({
			x: standard_cthreshold,
                        strokeDashArray: annotations_style,
                        borderColor: "#FF4560",
			label: {
                                borderColor: "#FF4560",
                                style: {
                                        color: "#fff",
                                        background: "#FF4560",
				},
				orientation: "vertical",
				borderWidth: 0,
				offsetY: -200,
                                text: undefined, // annotations_label_critical, //annotations_label_critical,
                                position: annotations_pos,
			},
		});
	}
	
	chart.updateOptions({
	annotations: {
		xaxis: annotations_xaxis,
        },
	}, enable_animations, enable_animations);
};
}
