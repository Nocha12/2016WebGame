/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - \n' +
      '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>*/\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: [
            'src/light.js',
            'src/core/Asset.js',
            'src/core/Game.js',
            'src/core/StateManager.js',
            'src/core/Timer.js',
            
            'src/geom/Point.js',
            'src/geom/Rectangle.js',
            
            'src/entities/Entity.js',
            'src/entities/EntityContainer.js',
            'src/entities/Sprite.js',
            'src/entities/MovieClip.js',
            'src/entities/Text.js',
            //'src/entities/particle/Particle.js',
            //'src/entities/particle/Emitter.js',
            
            'src/core/State.js',
            'src/core/Camera.js',
            
            'src/input/Input.js',
            'src/input/Keyboard.js',
            'src/input/Mouse.js',
            
            'src/physics/Physics.js',
            'src/physics/Body.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', ['concat', 'uglify']);

};
