module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
	});
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		paths: {
			test: 'test',
			test_specs: 'test/spec/*.spec.js',
			test_vendor: 'test/vendor',
			test_coverage: 'test/coverage',
			source_dir: 'src'
		},

		clean: {
			lib: 'lib/',
			test_vendor: '<%= paths.test_vendor %>',
			test_index: '<%= paths.test %>/index.html',
			test_coverage: '<%= paths.test_coverage %>',
			dot_grunt: '.grunt'
		},

		curl: {
			jquery: {
				src: 'http://code.jquery.com/jquery-2.2.3.min.js',
				dest: '<%= paths.test_vendor%>/jquery.js'
			},
			jasmine_jquery: {
				src: 'https://raw.githubusercontent.com/velesin/jasmine-jquery/2.1.1/lib/jasmine-jquery.js',
				dest: '<%= paths.test_vendor%>/jasmine-jquery.js'
			}
		},

		jshint: {
			all: [
				'Gruntfile.js',
				'<%= paths.source_dir %>/*.js',
				'<%= paths.test_specs %>'
			]
		},

		jasmine: {
			src: '<%= paths.source_dir %>/<%= pkg.name %>.js',
			options: {
				vendor: [
					'<%= paths.test_vendor %>/jquery.js',
					'<%= paths.test_vendor %>/jasmine-jquery.js',
				],
				specs: '<%= paths.test_specs %>',
				outfile: '<%= paths.test %>/index.html',
				keepRunner: true,
				template: require('grunt-template-jasmine-istanbul'),
				templateOptions: {
					coverage: '<%= paths.test_coverage %>/coverage.json',
					report: '<%= paths.test_coverage %>',
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
					banner: '/* <%= pkg.name %> ' +
						'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
						'<%= pkg.license %> licence */\n',
					sourceMap: true,
					enclose: {
						'window': 'exports'
					}
				},
				files: {
					'lib/<%= pkg.name %>.min.js':
						'<%= paths.source_dir %>/*.js'
				}
			}
		},

		open: {
			jasmine_jquery_releases: {
				path: "https://github.com/velesin/jasmine-jquery/releases"
			}
		}
	});

	grunt.registerTask('default', [
		'clean:lib',
		'if-missing:curl:jquery',
		'if-missing:curl:jasmine_jquery',
		'jshint',
		'jasmine',
		'uglify'
	]);

	// This task allows us to quickly check if there has been a new relase
	// of the jasmine-jquery library (`grunt open` would also do it).
	grunt.registerTask('check', ['open:jasmine_jquery_releases']);

	// The 'clean' task is defined wholly above.
};
