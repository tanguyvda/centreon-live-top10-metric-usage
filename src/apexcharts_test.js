function load_graph_apex(data, preferences) {

// colors
/*var colors = new Array();
colors.push('#88b917');
colors.push('#818285');
colors.push('#e00b3d');
colors.push('#818285');*/

var serie_data = new Array();
var host_name = new Array();
for (i in data) {

	/*if (data[i].status == 0) {
		var bar_color = colors['0'];
	} else if (data[i].status == 1) {
		var bar_color = colors['1'];
	} else if (data[i].status == 2) {
		var bar_color = colors['2'];
	} else {
		var bar_color = colors['3'];
	}*/
	
	serie_data.push({'y':data[i].current_value, 'x':data[i].host_name});//, 'colors':bar_color});
	host_name.push(data[i].host_name);
}
if (preferences.display_metric_value == 1) {
	var display_metric_value = true;
} else {
	var display_metric_value = false;
}
	
var options = {
	chart: {
		height: preferences.height,
                type: 'bar',
            },
	plotOptions: {
                bar: {
                	horizontal: true,
                }
            },
            dataLabels: {
                enabled: display_metric_value,
                position: 'top',
            },
	    //colors: colors,
            series: [{
                data: serie_data,
            }],
            xaxis: {
                categories: host_name,
            }
        }

       var chart = new ApexCharts(
            document.querySelector("#chart"),
            options
        );
        
        chart.render();
}
