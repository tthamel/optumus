module.exports = function(grunt) {
  'use strict';

  // Load up the Grunt modules used in our tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Tasks
  grunt.registerTask('default', [
    'watch'
  ]);

  grunt.registerTask('test', [
    'jshint'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify'
  ]);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'app.js', 'routes/*.js', 'db/**/*.js', 'app/**/*.js'],
      options: {
        globals: {
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      js: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
      },
      build: {
        files: ['<%= concat.js.src %>'],
        tasks: ['build']
      }
    },
    concat: {
      js: {
        options: {
          stripBanners: true
        },
        src: [
          'public/vendor/angular/angular.min.js',
          'public/vendor/angular-route/angular-route.min.js',
          'public/vendor/angular-cache/dist/angular-cache.min.js',
          'public/vendor/ids-core/ids-core.min.js',
          'app/appRoutes.js',
          'app/app.js',
          'app/core/**/*.js',
          'app/**/*.js'
        ],
        dest: 'public/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        mangle: false,
        wrap: false,
        banner: '/*! <%= pkg.name %> version: <%= pkg.version %>  <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: {
          'public/js/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
        }
      }
    }

  });

};
