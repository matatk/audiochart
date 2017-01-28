'use strict'

module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
	})
	require('time-grunt')(grunt)

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		paths: {
			test: 'test',
			testSpecs: 'test/spec/*.spec.js',
			testVendor: 'test/vendor',
			testCoverage: 'test/coverage',
			sourceDir: 'src',
			lib: 'lib',
			dotGrunt: '.grunt',
			doc: 'doc',
			docPublic: '<%= paths.doc %>/public',
			docInternal: '<%= paths.doc %>/internal'
		},

		clean: {
			lib: '<%= paths.lib %>',
			testVendor: '<%= paths.testVendor %>',
			testIndex: '<%= paths.test %>/index.html',
			testCoverage: '<%= paths.testCoverage %>',
			dotGrunt: '<%= paths.dotGrunt %>',
			doc: '<%= paths.doc %>'
		},

		curl: {
			jquery: {
				src: 'http://code.jquery.com/jquery-2.2.3.min.js',
				dest: '<%= paths.testVendor %>/jquery.js'
			},
			jasmineJquery: {
				src: 'https://raw.githubusercontent.com/velesin/jasmine-jquery/2.1.1/lib/jasmine-jquery.js',
				dest: '<%= paths.testVendor %>/jasmine-jquery.js'
			}
		},

		eslint: {
			target: [
				'Gruntfile.js',
				'<%= paths.sourceDir %>/<%= pkg.name %>.js',
				'<%= paths.testSpecs %>'
			]
		},

		jasmine: {
			src: '<%= paths.sourceDir %>/<%= pkg.name %>.js',
			options: {
				vendor: [
					'<%= paths.testVendor %>/jquery.js',
					'<%= paths.testVendor %>/jasmine-jquery.js',
				],
				specs: '<%= paths.testSpecs %>',
				outfile: '<%= paths.test %>/index.html',
				keepRunner: true,
				template: require('grunt-template-jasmine-istanbul'),
				templateOptions: {
					coverage: '<%= paths.testCoverage %>/coverage.json',
					report: '<%= paths.testCoverage %>',
					thresholds: {
						lines: 75,
						statements: 75,
						branches: 75,
						functions: 90
					}
				}
			}
		},

		uglify: {
			lib: {
				options: {
					beautify: false,
					mangle: true,
					banner: '/* <%= pkg.name %> <%= pkg.version %> - ' +
						'<%= grunt.template.today("yyyy-mm-dd") %> - ' +
						'<%= pkg.license %> licence */\n',
					sourceMap: true,
					enclose: {
						'window': 'exports'
					}
				},
				files: {
					'lib/<%= pkg.name %>.min.js':
						'<%= paths.sourceDir %>/*.js'
				}
			}
		},

		jsdoc: {
			pub: {
				src: ['<%= paths.sourceDir %>/<%= pkg.name %>.js'],
				options: {
					'destination': '<%= paths.docPublic %>',
					'private': false,
					'readme': 'README.md'
				}
			},
			internal: {
				src: ['<%= paths.sourceDir %>/<%= pkg.name %>.js'],
				options: {
					'destination': '<%= paths.docInternal %>',
					'private': true,
					'readme': 'README.md'
				}
			}
		},

		open: {
			jasmineJqueryReleases: {
				path: 'https://github.com/velesin/jasmine-jquery/releases'
			}
		}
	})

	grunt.registerTask('default', [
		'clean:lib',
		'if-missing:curl:jquery',
		'if-missing:curl:jasmineJquery',
		'eslint',
		'jasmine',
		'uglify',
		'jsdoc'
	])

	// This task allows us to quickly check if there has been a new relase
	// of the jasmine-jquery library (`grunt open` would also do it).
	grunt.registerTask('check', ['open:jasmineJquery_releases'])

	// The 'clean' task is defined wholly above.
}
