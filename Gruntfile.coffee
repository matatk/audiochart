module.exports = (grunt) ->
  # Project configuration
  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    # Check the CoffeeScript code
    coffeelint:
      all: ['*.coffee', 'spec/*.coffee']

    # Run the tests (via Node, in CoffeeScript)
    jasmine_node:
      options:
        forceExit: true
        match: "."
        matchall: false
        extensions: "coffee"
        specNameMatcher: "spec"
      all: [ "spec/" ]

    # Convert main code and specs to JavaScript
    coffee:
      main:
        options:
          sourceMap: true
        files:
          "build/audiochart.js": "audiochart.coffee"
      specs:
        expand: true
        cwd: 'spec/'
        src: ['*.spec.coffee']
        dest: 'test/spec/'
        ext: '.spec.js'

    # Minify the built JavaScript
    uglify:
      options:
        banner: '/*! <%= pkg.name %> ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
        sourceMap: true
        sourceMapIn: "build/audiochart.js.map"
      build:
        src: "build/audiochart.js"
        dest: "build/audiochart.min.js"

    # Copy the HTML fixtures from the CoffeeScript spec directory
    # to the JavaScript spec directory (for in-browser tests)
    copy:
      main:
        src: "spec/HTMLTableDataWrapper.fixtures.html"
        dest: "test/spec/HTMLTableDataWrapper.fixtures.html"

    # Ensure there's a local version of jasmine-all
    curl:
      "test/jasmine-all-min.js":
        "http://searls.github.io/jasmine-all/jasmine-all-min.js"
      "test/jasmine-dom-fixtures.js":
        "https://github.com/jeffwatkins/jasmine-dom/raw/master/lib/" +
        "jasmine-dom-fixtures.js"

    # Loading Tasks
    grunt.loadNpmTasks "grunt-coffeelint"
    grunt.loadNpmTasks "grunt-jasmine-node-new"
    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-uglify"
    grunt.loadNpmTasks "grunt-contrib-copy"
    grunt.loadNpmTasks "grunt-curl"
    grunt.loadNpmTasks "grunt-if-missing"

    # Setting up Tasks
    grunt.registerTask "default", [
      "coffeelint",
      "jasmine_node",
      "coffee",
      "uglify",
      "copy",
      "if-missing:curl"
    ]
