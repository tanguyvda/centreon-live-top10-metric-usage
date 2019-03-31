function load_graph_apex(widget_data, preferences) {


var serie_data = new Array();
var host_name = new Array();
var graph_data = new Array()
for (i in widget_data) {
	serie_data.push({'name':widget_data[i].host_name, 'y':widget_data[i].current_value, 'x':widget_data[i].host_name});//, 'colors':bar_color});
	host_name.push(widget_data[i].host_name);
}

console.log(serie_data);
if (preferences.display_metric_value == 1) {
	var display_metric_value = true;
} else {
	var display_metric_value = false;
}

if (preferences.animation_type == "") {
	var animation_type = "easeinout";
} else {
	var animation_type = preferences.animation_type;
}

if (preferences.datalabels_pos == "") {
	var datalabels_pos = "center";
} else { 
	var datalabels_pos = preferences.datalabels_pos;
}

if (preferences.title_pos == "") {
	var title_pos = "center";
} else {
	var title_pos = preferences.title_pos;
}

if (preferences.subtitle_pos == "") {
	var subtitle_pos = "center";
} else { 
	var subtitle_pos = preferences.subtitle_pos;
}

if (preferences.chart_title == "") {
	var chart_title = undefined;
} else {
	var chart_title = preferences.chart_title;
}

if (preferences.chart_subtitle == "") {
	var chart_subtitle = undefined;
} else { 
	var chart_subtitle = preferences.chart_subtitle;
}
	
var options = {
	chart: {
		height: preferences.height,
                type: 'bar',
		animations: {
			enabled: preferences.enable_animations,
			easing: animation_type,
			animategradually: {
				enabled: preferences.enable_animation,
			}
		}
            },
	plotOptions: {
        	bar: {
                	horizontal: preferences.bar_orientation,
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
		show: preferences.enable_legend,
	},
	    //colors: colors,
        series: [{
		data:serie_data,
	}],
}

       var chart = new ApexCharts(
            document.querySelector("#chart"),
            options
        );
        
        chart.render();
}
