google.load('visualization', '1.0', {'packages':['corechart']});
google.setOnLoadCallback(init);


//
// Utility Functions
//

/* Check for errors */
function error_check() {
	var freq_low_input = document.getElementById('opt-freq-low');
	var freq_high_input = document.getElementById('opt-freq-high');
	if (freq_low_input.valueAsNumber >= freq_high_input.valueAsNumber) {
		error_check_toggle('on');
	} else {
		error_check_toggle('off');
	}
}

/* Toggle error message visibility and aria-invalid state on controls */
function error_check_toggle(to_state) {
	error_check_toggle_messages(to_state);
	error_check_toggle_invalid(to_state);
}

/* Toggle error message visibility */
function error_check_toggle_messages(to_state) {
	var class_names = ['hidden-error-message', 'error-message'];
	var current_class = (to_state == 'on') ? class_names[0] : class_names[1];
	var desired_class = (to_state == 'on') ? class_names[1] : class_names[0];
	var error_paras = document.querySelectorAll('p.' + current_class);
	for (var i = 0; i < error_paras.length; i++ ) {
		error_paras[i].className = desired_class;
	}
}

/* Toggle aria-invalid on controls */
function error_check_toggle_invalid(to_state) {
	var number_inputs = document.querySelectorAll('input[type=number]');
	for (var i = 0; i < number_inputs.length; i++ ) {
		number_inputs[i].setAttribute("aria-invalid",
				(to_state == 'on') ? "true" : "false");
	}
}

/* Create a default options structure */
function make_audiochart_options() {
	return {
		// Fill in 'type'
		// Fill in 'data' and 'chart'
		//  or 'html_document' and 'html_table_id'
		'duration':
			parseInt(document.getElementById('opt-duration').value) * 1000,
		'frequency_low':
			document.getElementById('opt-freq-low').valueAsNumber,
		'frequency_high':
			document.getElementById('opt-freq-high').valueAsNumber
	};
}

/* Draw all the charts after the library has been loaded */
function init() {
	// Cheeky: wire up onchange events for the options controls here too
	function change_handler(id) {
		document.getElementById(id).addEventListener('change', error_check);
	}
	change_handler('opt-freq-low');
	change_handler('opt-freq-high');

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
		options['table'] = document.getElementById('table1');
		options['highlight_class'] = 'current-datum';
		new AudioChart(options);
	};
}

/* Library functions for drawing Google charts and handling events */

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
