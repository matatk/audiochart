module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			lib: 'lib/*',
			jasmine_jquery: [
				'test/jquery.js',
				'test/jasmine-jquery.js'
			]
		},

		curl: {
			jquery: {
				src: 'http://code.jquery.com/jquery-1.11.3.min.js',
				dest: 'test/jquery.js'
			},
			jasmine_jquery: {
				src: 'https://raw.github.com/velesin/jasmine-jquery/master/lib/jasmine-jquery.js',
				dest: 'test/jasmine-jquery.js'
			}
		},

		jshint: {
			all: ['Gruntfile.js', 'src/*.js', 'test/spec/*.js']
		},

		jasmine: {
			src: 'src/<%= pkg.name %>.js',
			options: {
				vendor: [
					'test/jquery.js',
					'test/jasmine-jquery.js'
				],
				specs: 'test/spec/*.spec.js',
				outfile: 'test/index.html',
				keepRunner: true
			}
		},

		uglify: {
			lib: {
				options: {
					beautify: true,
					mangle: false,
					banner: '/* <%= pkg.name %> ' +
						'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
						'<%= pkg.license %> licence */\n',
					sourceMap: true,
					enclose: {
						'window': 'exports'
					}
				},
				files: {
					'lib/<%= pkg.name %>.min.js': 'src/*.js'
				}
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
};
