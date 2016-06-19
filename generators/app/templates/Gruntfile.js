// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'js/*.js',
        '!js/scripts.min.js'
      ]
    },
    concat: {
      js: {
        options: {
          separator: ';'
        },
        src: [
          'bower_components/es6-promise/es6-promise.js',
          'bower_components/jquery/dist/jquery.js',
          'bower_components/tableau/dist/*.js',
          'bower_components/tether/dist/js/tether.js',
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'bower_components/wdcw/dist/wdcw.js',
          'src/**/*.js'
        ],
        dest: 'build/all.js'
      }
    },
    uglify: {
      options: {
        compress: true,
        mangle: true,
        sourceMap: true
      },
      target: {
        src: 'build/all.js',
        dest: 'build/all.min.js'
      }
    },<% if (props.needsProxy) { %>
    express: {
      server: {
        options: {
          script: 'index.js',
            port: 9001
        }
      }
    },<% } else { %>
    connect: {
      server: {
        options: {
          base: './',
          port: 9001
        }
      }
    },<% } %>
    watch: {
      scripts: {
        files: 'src/**/*.js',
        tasks: [
          'jshint',
          'concat',
          'uglify'<% if (props.needsProxy) { %>,
          'express:server'
        ],
        options: {
          spawn: false
        }<% } else { %>
        ]<% } %>
      }
    }<% if (props.deployTo === 'gh-pages') { %>,
    'gh-pages': {
      options: {
        base: '.'
      },
      src: ['**'],
      travisDeploy: {
        options: {
          user: {
            name: 'Travis Deployment',
            email: 'noreply@travis-ci.org'
          },
          repo: 'https://' + process.env.GH_TOKEN + '@github.com/repo-owner/<%= props.appname %>-connector.git',
          message: 'Auto-deploy via Travis CI',
          silent: true
        },
        src: ['**']
      }
    }<% } %>
  });

  grunt.loadNpmTasks('grunt-contrib-concat');<% if (props.needsProxy) { %>
  grunt.loadNpmTasks('grunt-express-server');<% } else { %>
  grunt.loadNpmTasks('grunt-contrib-connect');<% } %>
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');<% if (props.deployTo === 'gh-pages') { %>
  grunt.loadNpmTasks('grunt-gh-pages');<% } %>

  grunt.registerTask('default', [
    'build',
    'run'
  ]);

  grunt.registerTask('run', [<% if (props.needsProxy) { %>
    'express:server',<% } else { %>
    'connect:server',<% } %>
    'watch'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify'
  ]);<% if (props.deployTo === 'gh-pages') { %>

  grunt.registerTask('deploy', [
    'build',
    'gh-pages'
  ]);

  grunt.registerTask('autoDeploy', [
    'build',
    'gh-pages:travisDeploy'
  ]);<% } %>
};
