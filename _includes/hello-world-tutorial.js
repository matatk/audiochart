google.load('visualization', '1.0', {'packages':['corechart']});
google.setOnLoadCallback(draw_chart);

function draw_chart() {
	//
	// Google Charts Stuff
	//

	var data = new google.visualization.DataTable();

	// Populate the table
	data.addColumn('string', 'Top Secret Evil Project');
	data.addColumn('number', 'Watermelons');
	data.addRows([
			['Alpha',    293],
			['Beta',     329],
			['Gamma',    261],
			['Delta',    130],
			['Epsilon',  196],
			['Zeta',     196],
	]);

	// Prepare chart options, then create and draw the chart
	var chart_options = {
		'title': 'Evil Project Efficacy',
		'curveType': 'function'
	};

	var chart = new google.visualization.LineChart(
			document.getElementById('chart'));

	resizeChart();  // initial draw

	// Resizing; thanks, http://stackoverflow.com/a/23594901
	function resizeChart () {
		chart.draw(data, chart_options);
	}
	if (document.addEventListener) {
		window.addEventListener('resize', resizeChart);
	}
	else if (document.attachEvent) {
		window.attachEvent('onresize', resizeChart);
	}
	else {
		window.resize = resizeChart;
	}

	//
	// AudioChart Stuff
	//

	document.getElementById('play').onclick = function() {
		new AudioChart({
			'type': 'google',      // (see the docs)
			'data': data,          // the GoogleDataTable
			'chart': chart,        // the Google Chart object
			'duration': 5000,      // milliseconds
			'frequency_low': 200,  // Hz
			'frequency_high': 600  // Hz
		});
	}
}
