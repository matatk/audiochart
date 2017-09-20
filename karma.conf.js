'use strict'
module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine-jquery', 'jasmine'],
		files: [
			'src/audiochart.js',
			'spec/*.html',
			'spec/*.js'
		],
		preprocessors: {
			'src/audiochart.js': ['coverage']
		},
		reporters: ['spec', 'coverage'],
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['ChromeHeadless', 'Firefox'],
		singleRun: true,
		concurrency: Infinity,
		coverageReporter: {
			reporters: [
				{type: 'html', dir: 'coverage/', subdir: '.'},
				{type: 'text'},
			]
		}
	})
}
