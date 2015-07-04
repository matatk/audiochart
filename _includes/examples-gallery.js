google.load('visualization', '1.0', {'packages':['corechart']});
google.setOnLoadCallback(init);

//
// Utility Functions
//

/* Create a default options structure */
function make_audiochart_options() {
	return {
		// Fill in 'type'
		// Fill in 'data' and 'chart'
		//  or 'html_document' and 'html_table_id'
		'duration': 5000,
		'frequency_low': 200,
		'frequency_high': 600
	}
}

/* Draw all the charts on page load */
function init() {
	// Google Charts
	draw_line();
	draw_gradient();
	draw_sine();
	draw_sales_line();
	draw_sales_annotated();

	// JSON
	document.getElementById('btn_json1').onclick = function() {
		var options = make_audiochart_options();
		options['type'] = 'json';
		options['data'] = document.getElementById('json1').textContent;
		new AudioChart(options);
	};

	// HTML Table
	document.getElementById('btn_table1').onclick = function() {
		var options = make_audiochart_options();
		options['type'] = 'html_table';
		options['html_document'] = document;
		options['html_table_id'] = 'table1';
		options['html_table_highlight_class'] = 'audiochart-current';
		new AudioChart(options);
	};
}

/* Library functions for drawing Google charts... */

function _draw_line_chart_core(data, id, btn) {
	_draw_core(google.visualization.LineChart, data, id, btn);
}

function _draw_bar_chart_core(data, id, btn) {
	_draw_core(google.visualization.BarChart, data, id, btn);
}

function _draw_core(klass, data, chart_id, btn) {
	// Instantiate and draw our chart, passing in some options
	var google_options = {
		'title': 'Example',
		'curveType': 'function'
	};
	var chart = new klass(document.getElementById(chart_id));

	resizeChart();  // initial draw

	// Resizing; thanks, http://stackoverflow.com/a/23594901
	function resizeChart() {
		chart.draw(data, google_options);
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

	// Wire up to AudioChart
	document.getElementById(btn).onclick = function() {
		var audiochart_options = make_audiochart_options();
		audiochart_options['type'] = 'google';
		audiochart_options['data'] = data;
		audiochart_options['chart'] = chart;
		new AudioChart(audiochart_options);
	};
}


//
// Individual Charts
//

function draw_line() {
	// Create the data table.
	var data = new google.visualization.DataTable();

	var MIN = 0;
	var MAX = 1;
	var DELTA = 0.1;
	var results = [];
	var index = 0;
	for( var i = MIN; i <= MAX; i = i + DELTA ) {
		results[index] = [i, 42];
		index++;
	}

	data.addColumn('number', 'blah');
	data.addColumn('number', 'blah');
	data.addRows(results);

	_draw_line_chart_core(data, 'chart_line', 'btn_line');
}

function draw_gradient() {
	// Create the data table.
	var data = new google.visualization.DataTable();

	var MIN = 0;
	var MAX = 1;
	var DELTA = 0.01;
	var results = [];
	var index = 0;
	for( var i = MIN; i <= MAX; i += DELTA ) {
		results[index] = [i, i];
		index++;
	}

	data.addColumn('number', 'blah');
	data.addColumn('number', 'blah');
	data.addRows(results);

	_draw_line_chart_core(data, 'chart_gradient', 'btn_gradient');
}

function draw_sine() {
	// Create the data table.
	var data = new google.visualization.DataTable();

	var MIN = -Math.PI;
	var MAX = Math.PI;
	var DELTA = 0.01;
	var results = [];
	var index = 0;
	for( var i = MIN; i <= MAX; i = i + DELTA ) {
		results[index] = [i, Math.sin(i)];
		index++;
	}

	data.addColumn('number', 'Radians');
	data.addColumn('number', 'Sine');
	data.addRows(results);

	_draw_line_chart_core(data, 'chart_sine', 'btn_sine');
}

function draw_sales_line() {
	// Create the data table.
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Month'); // Implicit domain label col.
	data.addColumn('number', 'Sales'); // Implicit series 1 data col.
	data.addRows([
			['April',1000],
			['May',  1170],
			['June',  660],
			['July', 1030]
	]);

	_draw_line_chart_core(data, 'chart_sales_line', 'btn_sales_line');
	_draw_bar_chart_core(data, 'chart_sales_bar', 'btn_sales_bar');
}

function draw_sales_annotated() {
	// Create the data table.
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Month'); // Implicit domain label col.
	data.addColumn('number', 'Sales'); // Implicit series 1 data col.
	data.addColumn({type:'number', role:'interval'});
	// interval role col.
	data.addColumn({type:'number', role:'interval'});
	// interval role col.
	data.addColumn({type:'string', role:'annotation'});
	// annotation role col.
	data.addColumn({type:'string', role:'annotationText'});
	// annotationText col.
	data.addColumn({type:'boolean',role:'certainty'});
	// certainty col.
	data.addRows([
			['April',1000,  900, 1100,  'A','Stolen data', true],
			['May',  1170, 1000, 1200,  'B','Coffee spill', true],
			['June',  660,  550,  800,  'C','Wumpus attack', true],
			['July', 1030, null, null, null, null, false]
	]);

	_draw_line_chart_core(data, 'chart_sales_annotated', 'btn_sales_annotated');
}
