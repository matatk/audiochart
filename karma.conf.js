'use strict'
module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [
			'src/*.js',
			'spec/*.html',
			'spec/util*.js',
			'spec/*.spec.js'
		],
		preprocessors: {
			'src/*.js': ['coverage']
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
		},
		customLaunchers: {
			ChromeHeadlessNoSandbox: {
				base: 'ChromeHeadless',
				flags: ['--no-sandbox']
			}
		}
	})

	if (config.grep) {
		config.set({
			client: {
				args: ['--grep', config.grep]
			}
		})
	}
}
