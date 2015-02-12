'use strict';
module.exports = function(grunt) {
  // Load all tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time
  require('time-grunt')(grunt);

  var jsFileList = [
    'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
    'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
    'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/button.js',
    'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
    'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
    'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
    'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
    'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
    'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/popover.js',
    'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
    'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
    'assets/vendor/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
    'assets/js/plugins/*.js',
    'assets/js/_*.js'
  ];

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'assets/js/*.js',
        '!assets/js/scripts.js',
        '!assets/**/*.min.*'
      ]
    },
    compass: {
      options: {
        httpPath: "/",
        cssDir: "assets/css",
        sassDir: "assets/sass",
        imagesDir: "assets/img",
        javascriptsDir: "assets/js",
      },
      dev: {
        options: {
          force: true
        }
      },
      build: {
        options: {
          outputStyle: 'compressed',
          force: true
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [jsFileList],
        dest: 'assets/js/scripts.js',
      },
    },
    uglify: {
      dist: {
        files: {
          'assets/js/scripts.min.js': [jsFileList]
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
      },
      dev: {
        options: {
          map: {
            prev: 'assets/css/'
          }
        },
        src: 'assets/css/main.css'
      },
      build: {
        src: 'assets/css/main.css'
      }
    },
    modernizr: {
      build: {
        devFile: 'assets/vendor/modernizr/modernizr.js',
        outputFile: 'assets/js/vendor/modernizr.min.js',
        files: {
          'src': [
            ['assets/js/scripts.min.js'],
            ['assets/css/main.min.css']
          ]
        },
        extra: {
          shiv: false
        },
        uglify: true,
        parseFiles: true
      }
    },
    browserSync: {
      bsFiles: {
        src : [
          'assets/css/*.css',
          'assets/js/*.js',
          'assets/img/**/*',
          '**/*.php'
        ]
      },
      options: {
        proxy: "tkt.localhost",
        watchTask: true
      }
    },
    version: {
      default: {
        options: {
          format: true,
          length: 32,
          manifest: 'assets/manifest.json',
          querystring: {
            style: 'roots_css',
            script: 'roots_js'
          }
        },
        files: {
          'lib/scripts.php': 'assets/{css,js}/{main,scripts}.min.{css,js}'
        }
      }
    },
    watch: {
      less: {
        files: [
          'assets/sass/*.scss',
          'assets/sass/**/*.scss'
        ],
        tasks: ['compass', 'autoprefixer:dev']
      },
      js: {
        files: [
          jsFileList,
          '<%= jshint.all %>'
        ],
        tasks: ['jshint', 'concat']
      },
      livereload: {
        // Browser live reloading
        // https://github.com/gruntjs/grunt-contrib-watch#live-reloading
        options: {
          livereload: false
        },
        files: [
          'assets/css/main.css',
          'assets/js/scripts.js',
          'templates/*.php',
          '*.php'
        ]
      }
    }
  });

  // Register tasks
  grunt.registerTask('default', [
    'dev','browserSync','watch'
  ]);
  grunt.registerTask('dev', [
    'jshint',
    'compass:dev',
    'autoprefixer:dev',
    'concat'
  ]);
  grunt.registerTask('build', [
    'jshint',
    'compass:build',
    'autoprefixer:build',
    'uglify',
    'modernizr',
    'version'
  ]);
};
