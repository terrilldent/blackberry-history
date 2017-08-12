module.exports = function(grunt) {
    
  grunt.file.mkdir('build');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    
    clean: {
      build: {
        src: [ 'build' ]
      },
    },
    
    copy: {
      build: {
        cwd: 'src',
        src: [ '**', '!**/*.less' ],
        dest: 'build',
        expand: true
      },
    },

    preprocess : {
      html : {
        src : [ 'build/**/*.html' ],
        options: {
          inline : true,
          context : {
            DEBUG: false
          }
        }
      }
    },
    
    concat: {
      options: {
        separator: ';',
      },
      js: {
        src: ['build/www/js/*.js' ],
        dest: 'build/www/<%= pkg.name %>.js',
      },
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/www/<%= pkg.name %>.js',
        dest: 'build/www/<%= pkg.name %>.min.js'
      }
    },

    less: {
      options: {
        imports: {
          reference: [
            "src/www/css/mixins.less", 
            "src/www/css/variables.less" 
          ]
        }
      },
      development: {
        files: [{
          expand: true,
          cwd: 'src/www/css/',
          src: ['*.less', '!{var,mix}*.less'],
          dest: 'build/www/css/',
          ext: '.css'
        }]
      },
      production: {
        options: {
          cleancss: true
        },
        files: [{
          expand: true,
          cwd: 'src/www/css/',
          src: ['*.less', '!{var,mix}*.less'],
          dest: 'build/www/css/',
          ext: '.css'
        }]
      }
    },

    nodestatic: {
      server: {
        options: {
          port: 8090,
          base: 'build/www/'
        }
      }
    },
    
    watch: {
      scripts: {
        files: ['src/www/**/*'],
        tasks: ['build'],
        options: {
          spawn: false,
          debounceDelay: 250,
          livereload: true
        },
      },
    }

  });

  grunt.registerTask('open-browser', function() {
    var open = require('open');
    open('http://localhost:8090');
  });

  // Load the plugin that provides tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-nodestatic');

  // Default task
  grunt.registerTask('build', ['clean', 'copy:build', 'preprocess:html', 'less:development' ]);
  grunt.registerTask('production', ['clean', 'copy:build', 'preprocess:html', 'concat:js', 'uglify:build', 'less:production' ]);
  grunt.registerTask('default', ['build', 'nodestatic', 'open-browser', 'watch' ]);

};