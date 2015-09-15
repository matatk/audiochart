module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      lib: 'lib/'
    },

    jshint: {
      all: ['Gruntfile.js', 'src/*.js', 'test/spec/*.js']
    },

    jasmine: {
      src: 'src/<%= pkg.name %>.js',
      options: {
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
            '<%= grunt.template.today("yyyy-mm-dd") %> \n' +
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
  },

  grunt.registerTask('default', [
    'clean',
    'jshint',
    'jasmine',
    'uglify'
  ]));
};
