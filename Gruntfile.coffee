module.exports = (grunt) ->
	# Project configuration
	grunt.initConfig
		pkg: grunt.file.readJSON "package.json"

		coffee:
			compile:
				files:
					"build/audiochart.js": "audiochart.coffee"
			glob_to_multiple:
				expand: true
				cwd: 'spec/'
				src: ['*.spec.coffee']
				dest: 'test/spec/'
				ext: '.spec.js'

		copy:
			main:
				src: "spec/HTMLTableDataWrapper.fixtures.html"
				dest: "test/spec/HTMLTableDataWrapper.fixtures.html"

		uglify:
			options:
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			build:
				src: "build/audiochart.js"
				dest: "build/audiochart.min.js"

		jasmine_node:
			options:
				forceExit: true
				match: "."
				matchall: false
				extensions: "coffee"
				specNameMatcher: "spec"
			all: [ "spec/" ]
	
	# Loading Tasks
	grunt.loadNpmTasks "grunt-contrib-coffee"
	grunt.loadNpmTasks "grunt-contrib-copy"
	grunt.loadNpmTasks "grunt-contrib-uglify"
	grunt.loadNpmTasks "grunt-jasmine-node"
	
	# Setting up Tasks
	grunt.registerTask "default", [ "jasmine_node", "coffee", "copy", "uglify" ]
