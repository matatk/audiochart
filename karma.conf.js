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
		reporters: ['progress'],
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome', 'Firefox'],
		singleRun: true,
		concurrency: Infinity
	})
}
