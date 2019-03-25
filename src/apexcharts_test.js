function load_graph_apex(data) {
console.log(data);
var metric_value = new Array();
var host_name = new Array();
for (i in data) {
metric_value.push(data[i].current_value);
host_name.push(data[i].host_name);
console.log(metric_value);
}
     var options = {
            chart: {
                height: 350,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: true,
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
