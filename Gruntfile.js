module.exports = function(grunt) {
  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    coffee: {
      compile: {
        files: {
          'build/audiochart.js': 'audiochart.coffee',
          'test/spec/DataWrappers.common.spec.js': 'spec/DataWrappers.common.spec.coffee',
          'test/spec/GoogleDataWrapper.spec.js': 'spec/GoogleDataWrapper.spec.coffee',
          'test/spec/HTMLTableDataWrapper.spec.js': 'spec/HTMLTableDataWrapper.spec.coffee',
          'test/spec/JSONDataWrapper.spec.js': 'spec/JSONDataWrapper.spec.coffee',
          'test/spec/PitchMappers.spec.js': 'spec/PitchMappers.spec.coffee',
          'test/spec/Player.spec.js': 'spec/Player.spec.coffee',
          'test/spec/WebAudioSounder.spec.js': 'spec/WebAudioSounder.spec.coffee',
          'test/spec/google_visual_callback.spec.js': 'spec/google_visual_callback.spec.coffee'
        }
      }
	},

    copy: {
      main: {
	    src: 'spec/HTMLTableDataWrapper.fixtures.html',
        dest: 'test/spec/HTMLTableDataWrapper.fixtures.html'
	  }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/audiochart.js',
        dest: 'build/audiochart.min.js'
      }
    },

    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'coffee',
        specNameMatcher: 'spec',
      },
      all: ['spec/']
    }
  });

  // Loading Tasks
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jasmine-node');

  // Setting up Tasks
  grunt.registerTask('default', ['jasmine_node', 'coffee', 'copy', 'uglify']);
};
