function load_graph_apex(data, preferences) {
console.log(data);
console.log(preferences);
var metric_value = new Array();
var host_name = new Array();

for (i in data) {
	metric_value.push(data[i].current_value);
	host_name.push(data[i].host_name);
}

if (preferences.display_metric_value == 1) {
	var display_metric_value=true;
} else {
	var display_metric_value=false;
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
            series: [{
                data: metric_value
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
